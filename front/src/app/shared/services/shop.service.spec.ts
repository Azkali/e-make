import { TestBed, inject } from '@angular/core/testing';

import { ShopService } from './shop.service';

describe( 'DataManagerService', () => {
	beforeEach( () => {
		TestBed.configureTestingModule( {
			providers: [ShopService],
		} );
	} );

	it( 'should be created', inject( [ShopService], ( service: ShopService ) => {
		expect( service ).toBeTruthy();
	} ) );
} );
