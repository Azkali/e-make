import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable, BehaviorSubject, AsyncSubject } from 'rxjs';

import { MarkdownScrapperService, IArticle, IBlogArticle } from '~services/markdown-scrapper/markdown-scrapper.service';
import { first } from 'rxjs/operators';

@Component( {
	selector: 'app-article',
	templateUrl: './article.component.html',
	styleUrls: ['./article.component.css'],
} )
export class ArticleComponent implements OnInit {
	private readonly articleSubject = new AsyncSubject<IBlogArticle>();
	public article = this.articleSubject.asObservable();
	public title: string;

	public constructor(
		private readonly route: ActivatedRoute,
		private readonly markdownScrapperService: MarkdownScrapperService ) {
		}
		
		public ngOnInit() {
			this.route.params.pipe(first()).subscribe( params => {
				this.title = params['title'];
				this.markdownScrapperService.getBlogArticle(this.title)
					.pipe(first())
					.subscribe( article => {
						console.log(article)
						this.articleSubject.next( article )
						this.articleSubject.complete()
					} )
			} );
		}
}
