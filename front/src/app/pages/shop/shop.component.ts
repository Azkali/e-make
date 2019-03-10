import { Component, OnInit } from '@angular/core';
import {  BehaviorSubject } from 'rxjs';

import { IProduct } from '~models/product';

import { IAttribute } from '~models/attribute';
import { HeaderService } from '~services/header/header.service';
import { ShopService } from '~services/shop/shop.service';

@Component( {
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.css'],
	providers: [HeaderService],
} )
export class ShopComponent implements OnInit {
	public products = new BehaviorSubject<IProduct[]>( [] );
	public attributes = new BehaviorSubject<IAttribute[]>( [] );

	public constructor(
		private readonly shopService: ShopService,
	) {}

	public ngOnInit() {
		this.shopService.readyState
			.subscribe(
				undefined,
				err => console.error( 'Initialization failed', err ),
				() => this.reloadProducts(),
			);
	}

	private reloadProducts() {
		this.shopService.getAllProducts().subscribe( products => {
			if ( products !== null ) {
				this.products.next( products );
			}
		} );
	}

}
