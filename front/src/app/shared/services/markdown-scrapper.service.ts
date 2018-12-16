import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRepositoryTreeResponse, IEntry } from '../../shared/models/markdown-config';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { retry, tap } from 'rxjs/operators';
import { Tree } from '@angular/router/src/utils/tree';

const branch = 'master';
const repo = 'Azkali/e-make-articles';
const summaryFile = 'Summary.md';
const indexFile = 'Index.md';

export interface IArticle {
	title: string;
	summary: string;
	path: string;
}

@Injectable( {
	providedIn: 'root',
} )
export class MarkdownScrapperService {

	public constructor( private http: HttpClient ) { }

	private treeUrl = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;

	private getTree() {
		return this.http.get<IRepositoryTreeResponse>( this.treeUrl );
	}

	private getRawContentUrl( path: string ) {
		return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
	}

	private getSummary() {
		return this.http.get( this.getRawContentUrl( summaryFile ) , {responseType: 'text'} );
	}

	public observeArticles(): Observable<IArticle[]> {
		const observable = forkJoin( this.getTree(), this.getSummary() );
		observable.subscribe( ( [tree, summary] ) => console.log( tree, summary ) );
		return observable
			.pipe( retry( 3 ), ( resolvedObservable ) => {
				const articleSummaries = new BehaviorSubject<IArticle[]>( [] );
				resolvedObservable.subscribe( ( [repositoryTree, summary] ) => {
					const summaries = summary
						.split( /^-+$/m )
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

					articleSummaries.next( repositoryTree.tree.map( entry => {
						const expectedTitle = entry.path.replace( /^(?:.*?\/)?(.*)\.md$/, '$1' );
						const relatedSummary = summaries.find( sum => sum.title === expectedTitle );

						if ( relatedSummary ) {
							return {
								title: expectedTitle,
								summary: relatedSummary.summary,
								path: entry.path,
							};
						} else {
							return undefined;
						}
					} ).filter( article => !!article ) );
				} );
				return articleSummaries;
			} );
	}
}
