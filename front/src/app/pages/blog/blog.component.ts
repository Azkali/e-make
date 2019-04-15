import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { PagerService, IPage } from '~app/services/pager/pager';
import { IBlogArticle, MarkdownScrapperService } from '~services/markdown-scrapper/markdown-scrapper.service';

@Component( {
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.scss'],
	providers: [MarkdownScrapperService],
} )
export class BlogComponent implements OnInit {
	private readonly pagedArticlesSubject = new BehaviorSubject<IBlogArticle[]>( undefined );
	public readonly pagedArticles = this.pagedArticlesSubject.asObservable();

	public readonly tree = this.markdownScrapperService.getBlogArticles();

	public pager?: IPage;
	public articleLength: number;

	public constructor( private readonly markdownScrapperService: MarkdownScrapperService, private readonly pagerService: PagerService ) { }

	public ngOnInit() {
		this.setPage( 1 );
	}

	/* Pager setPage Function */
	public setPage( page: number ) {
		this.tree.pipe( first() ).subscribe( articles => {
			this.articleLength = articles.length;
			// get pager object from service
			this.pager = this.pagerService.getPager( this.articleLength, page, 3 );
			this.pagedArticlesSubject.next( articles.slice( this.pager.startIndex, this.pager.endIndex + 1 ) );
		} );
	}
}
