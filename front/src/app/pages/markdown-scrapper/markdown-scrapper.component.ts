import { Component, OnInit } from '@angular/core';
import { MarkdownScrapperService, IArticle, IBlogArticle } from '../../shared/services/markdown-scrapper.service';
import { IRepositoryTreeResponse, IEntry } from '../../shared/models/markdown-config';
import { BehaviorSubject, Observable } from 'rxjs';

@Component( {
	selector: 'app-markdown-scrapper',
	templateUrl: './markdown-scrapper.component.html',
	styleUrls: ['./markdown-scrapper.component.css'],
	providers: [MarkdownScrapperService],
} )
export class MarkdownScrapperComponent {
	public tree: Observable<IBlogArticle[]>;

	public constructor( private markdownScrapperService: MarkdownScrapperService ) {
		this.tree = this.markdownScrapperService.getBlogArticles();
	}
}
