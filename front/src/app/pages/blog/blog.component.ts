import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { MarkdownScrapperService, IArticle, IBlogArticle } from '~services/markdown-scrapper/markdown-scrapper.service';
import { IRepositoryTreeResponse, IEntry } from '../../models/markdown-config';

@Component( {
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.css'],
	providers: [MarkdownScrapperService],
} )
export class BlogComponent {
	public tree: Observable<IBlogArticle[]>;

	public constructor( private markdownScrapperService: MarkdownScrapperService ) {
		this.tree = this.markdownScrapperService.getBlogArticles();
	}
}
