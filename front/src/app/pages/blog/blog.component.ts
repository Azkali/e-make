import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MarkdownScrapperService, IArticle, IBlogArticle } from '~services/markdown-scrapper/markdown-scrapper.service';
import { PagerService } from '~app/services/pager/pager';



@Component( {
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.css'],
	providers: [MarkdownScrapperService],
} )
export class BlogComponent implements OnInit {
	// public pagerStart = 1;
	private allItems: any[];

	public tree: Observable<IBlogArticle[]>;

	public pager: any = {};
	public pagedItems: any[];
	public articleLenght: number;


	public constructor( private markdownScrapperService: MarkdownScrapperService, private pagerService: PagerService ) { }

	public ngOnInit() {
		this.tree = this.markdownScrapperService.getBlogArticles();
		this.setPage( 1 );
	}
	/* Pager setPage Function */
	public setPage( page: number ) {
		this.tree.subscribe( articles => {
			this.articleLenght = articles.length;
			this.allItems = articles.slice( this.pager.startIndex, this.pager.endIndex + 1 );
		} );
		// get pager object from service
		this.pager = this.pagerService.getPager( this.articleLenght, page, 3 );

		// get current page of items
		this.pagedItems = this.allItems;
	}
}
