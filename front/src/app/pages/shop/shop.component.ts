import { Component, OnInit } from '@angular/core';
import {  BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { IProduct } from '~models/product';

import { ShopService } from '~services/shop/shop.service';
import { HeaderService } from '~services/header/header.service';
import { IAttribute } from '~models/attribute';

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
		private shopService: ShopService
	) {}

	public ngOnInit() {
		this.shopService.readyState
			.subscribe(
				undefined,
				err => console.error( 'Initialization failed', err ),
				() => this.reloadProducts()
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
