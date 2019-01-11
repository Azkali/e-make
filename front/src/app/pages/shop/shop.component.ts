import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../shared/services/shop/shop.service';
import {  BehaviorSubject } from 'rxjs';
import { IProduct } from '../../../../../cross/models/product';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../shared/services/header/header.service';

@Component( {
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.css'],
	providers: [HeaderService],
} )
export class ShopComponent implements OnInit {
	public products = new BehaviorSubject<IProduct[]>( [] );

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
