import { TestBed } from '@angular/core/testing';

import { MarkdownScrapperService } from './markdown-scrapper.service';

describe( 'MarkdownScrapperService', () => {
	beforeEach( () => TestBed.configureTestingModule( {} ) );

	it( 'should be created', () => {
		const service: MarkdownScrapperService = TestBed.get( MarkdownScrapperService );
		expect( service ).toBeTruthy();
	} );
} );
