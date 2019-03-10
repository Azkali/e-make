import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MarkdownScrapperService, IArticle, IBlogArticle } from '~services/markdown-scrapper/markdown-scrapper.service';
import { PagerService } from '~app/services/pager/pager';
import { first } from 'rxjs/operators';



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
	public articleLength: number;


	public constructor( private readonly markdownScrapperService: MarkdownScrapperService, private readonly pagerService: PagerService ) { }

	public ngOnInit() {
		this.tree = this.markdownScrapperService.getBlogArticles();
		this.setPage( 1 );
	}
	
	/* Pager setPage Function */
	public setPage( page: number ) {
		this.tree.pipe(first()).subscribe( articles => {
			this.articleLength = articles.length;
			// get pager object from service
			this.pager = this.pagerService.getPager( this.articleLength, page, 3 );
			this.allItems = articles.slice( this.pager.startIndex, this.pager.endIndex + 1 );
		} );
	}
}
