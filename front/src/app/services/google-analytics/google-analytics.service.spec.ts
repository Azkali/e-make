import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Router } from '@angular/router';
import { GoogleAnalyticsService } from './google-analytics.service';

describe( 'GoogleAnalyticsService', () => {
	let router: Router;
	let fixture;

	beforeEach( () => {
		TestBed.configureTestingModule( {
			imports: [ RouterTestingModule.withRoutes( [] ) ],
			providers: [ GoogleAnalyticsService ],
		} );
		router = TestBed.get( Router );
	} );

	it( 'should be created', inject( [GoogleAnalyticsService], ( service: GoogleAnalyticsService ) => {
		expect( service ).toBeTruthy();
	} ) );
} );
