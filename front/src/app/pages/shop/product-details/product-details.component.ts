import { IProductViewModel } from './../../../shared/services/shop.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../shared/services/shop.service';
import { BehaviorSubject, AsyncSubject } from 'rxjs';

@Component( {
	selector: 'app-product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.css'],
} )
export class ProductDetailsComponent implements OnInit {
	public product = new BehaviorSubject<IProductViewModel|undefined>( undefined );

	public constructor( private route: ActivatedRoute, private shopService: ShopService ) {
		this.route.params.subscribe( params => {
			this.shopService.getAllProducts()
			.subscribe( allProducts => {
				const newValue = allProducts
				.find( testedProduct => testedProduct.name === params.identifier );
				console.log( {newValue, id: params.identifier, allProducts} );
				this.product.next( newValue );
			} );
		} );
	}

	public ngOnInit() {
		console.log( 'Go for details' );
	}

}
