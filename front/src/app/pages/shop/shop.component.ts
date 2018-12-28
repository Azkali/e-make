import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../shared/services/shop/shop.service';
import {  BehaviorSubject } from 'rxjs';
import { IProduct } from '../../../../../cross/models/product';
import { ActivatedRoute } from '@angular/router';

@Component( {
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.css'],
} )
export class ShopComponent implements OnInit {
	public products = new BehaviorSubject<IProduct[]>( [] );

	public constructor( private route: ActivatedRoute, private shopService: ShopService ) {
		this.route.data.subscribe( params => {
			console.log( {params} );
		} );
	}

	public ngOnInit() {
		this.shopService.readyState
			.subscribe(
				undefined,
				err => console.error( 'Initialization failed', err ),
				() => this.reloadProducts()
			);
	}

	private reloadProducts() {
		console.info( 'Refresh shop content' );

		this.shopService.getAllProducts().subscribe( products => {
			console.log( 'Reloaded products', products );
			if ( products !== null ) {
				this.products.next( products );
			}
		} );
	}

}
