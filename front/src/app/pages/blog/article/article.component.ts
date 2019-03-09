import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';

import { MarkdownScrapperService, IArticle, IBlogArticle } from '~services/markdown-scrapper/markdown-scrapper.service';

@Component( {
	selector: 'app-article',
	templateUrl: './article.component.html',
	styleUrls: ['./article.component.css'],
} )
export class ArticleComponent implements OnInit {
	public article;
	public sub;
	public title: string;

	public constructor(
		private route: ActivatedRoute,
		private markdownScrapperService: MarkdownScrapperService ) {

		this.markdownScrapperService.getBlogArticles().subscribe(
			articles => {
				articles.forEach(
					article => {
						if ( this.title === article.title ) {
							this.article = article;
							console.log( this.article );
						} else {
							console.log( ' NooNooNooo' );
						}
					}
				);
			}
		);
	}

	public ngOnInit() {
		this.sub = this.route.params.subscribe( params => {
			this.title = params['title'];
		} );
	}
}
