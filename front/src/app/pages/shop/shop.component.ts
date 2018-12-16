import { MarkdownScrapperService } from './../../shared/services/markdown-scrapper.service';
import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../shared/services/shop.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Entity, Set } from '@diaspora/diaspora/dist/types';
import { IProduct } from '../../../../../cross/models/product';

@Component( {
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.css'],
} )
export class ShopComponent implements OnInit {
	public products = new BehaviorSubject<IProduct[]>( [] );

	public constructor( private dataManagerService: ShopService ) {
	}

	public ngOnInit() {
		this.dataManagerService.readyState
			.subscribe(
				undefined,
				err => console.error( 'Initialization failed', err ),
				() => this.reloadProducts()
			);
	}

	private reloadProducts() {
		console.info( 'Refresh shop content' );

		this.dataManagerService.getAllProducts().subscribe( products => {
			console.log( 'Reloaded products', products );
			if ( products !== null ) {
				this.products.next( products );
			}
		} );
	}

}
