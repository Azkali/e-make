import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../shared/services/shop.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Entity, Set } from '@diaspora/diaspora/dist/types';
import { IProduct } from '../../../../../cross/models/product';

@Component( {
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.css'],
	providers: [ShopService],
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
	
	private async reloadProducts(){
		console.info( 'Refresh shop content' );

		const allItems = await this.dataManagerService.getAllProducts();

		if ( allItems !== null ){
			this.products.next( allItems.toChainable( Set.ETransformationMode.ATTRIBUTES ).value() );
		}
	}

}
