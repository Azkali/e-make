import { Component, OnInit } from '@angular/core';

@Component( {
	selector: 'app-article',
	templateUrl: './article.component.html',
	styleUrls: ['./article.component.css'],
} )
export class ArticleComponent implements OnInit {
	public article: any;
	public getRawContentUrl( article: any ) {}

	public constructor() { }

	public ngOnInit() {
	}

}
