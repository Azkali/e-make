import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { retry, map } from 'rxjs/operators';
import * as _ from 'lodash';

import { environment } from '~environments/environment';

import { IRepositoryTreeResponse, IEntry } from '../../models/markdown-config';

const branch = 'master';
const repo = 'Azkali/e-make-articles';
const summaryFile = 'Summary.md';
const indexFile = 'Index.md';
const apiFetchUrl = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;

export interface IArticle {
	title: string;
	summary: string;
}
export interface IBlogArticle  extends IArticle {
	path: string;
}
export interface IProductArticle  extends IArticle {
	pathProductPage: string;
	pathArticle: string;
}

@Injectable( {
	providedIn: 'root',
} )
export class MarkdownScrapperService {

	public constructor( private http: HttpClient ) {
		this.http.get<IRepositoryTreeResponse>( apiFetchUrl ).subscribe( repoContent => {
			this.apiContent.next( repoContent );
			this.apiContent.complete();
		} );
	}
	private apiContent = new AsyncSubject<IRepositoryTreeResponse>();
	private summariesCache: _.Dictionary<Observable<IArticle[]>> = {};

	private static parseSummaryFileContent( summary: string ) {
		return summary
		.split( /^-{3,}$/m )
		.filter( articleSummary => !!articleSummary )
		.map( articleSummary => {
			const summaryNameMatch = articleSummary.match( /^#\s*(.+)\s*$/m );
			if ( !summaryNameMatch || summaryNameMatch.index < 0 ) {
				throw new Error( 'Misformatted summary: ' + articleSummary );
			}

			const title = summaryNameMatch[1].trim();
			const endTitlePos = summaryNameMatch.index + summaryNameMatch[0].length;

			return {
				title,
				summary: articleSummary.slice( endTitlePos, articleSummary.length ),
			};
		} );
	}

	public static getRawContentUrl( path: string ) {
		return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
	}

	private getSummaries( directoryName?: string ) {
		const cachedValue = this.summariesCache[directoryName];
		if ( cachedValue ) {
			if ( environment.common.production === false ) {
				console.info( `Using cached value for directory ${directoryName}`, cachedValue );
			}
			return cachedValue;
		}

		const basePath = directoryName ? directoryName + '/' : '';
		const url = MarkdownScrapperService.getRawContentUrl( basePath + summaryFile );
		this.summariesCache[directoryName] = this.http.get( url, {responseType: 'text'} )
			.pipe( map( allSummaries => MarkdownScrapperService.parseSummaryFileContent( allSummaries ) ) );
		return this.summariesCache[directoryName];
	}

	public getBlogArticles() {
		return this.getRawDirectoryContent( 'blog' ).pipe(
			map( ( {entries, summaries} ) => entries.map( entry => {
				const expectedTitle = entry.path.replace( /^(?:.*?\/)?(.*)\.md$/, '$1' );
				const relatedSummary = summaries.find( sum => sum.title === expectedTitle );

				if ( relatedSummary ) {
					return {
						title: relatedSummary.title,
						summary: relatedSummary.summary,
						path: entry.path,
					};
				} else {
					return undefined;
				}
				} ).filter( entry => entry )
			)
		);
	}

	public getProductArticles() {
		return this.getRawDirectoryContent( 'products' );
	}

	private getRawDirectoryContent(
		basePath: string
	) {
		const observable = forkJoin( this.apiContent, this.getSummaries( basePath ) );
		return observable
			.pipe( retry( 3 ), map( ( [repoTree, summaries] ) => ( {
				entries: repoTree.tree.filter( item => item.path.startsWith( basePath ) ),
				summaries,
			} ) ) );
	}
}
