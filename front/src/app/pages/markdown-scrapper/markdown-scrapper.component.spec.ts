import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownScrapperComponent } from './markdown-scrapper.component';

describe( 'MarkdownScrapperComponent', () => {
	let component: MarkdownScrapperComponent;
	let fixture: ComponentFixture<MarkdownScrapperComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ MarkdownScrapperComponent ],
		} )
		.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( MarkdownScrapperComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
