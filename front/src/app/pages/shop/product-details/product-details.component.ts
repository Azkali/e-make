import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEntityProperties } from '@diaspora/diaspora/dist/types/types/entity';
import * as _ from 'lodash';

import { IAttribute } from '~models/attribute';
import { IProduct } from '~models/product';

import { BehaviorSubject } from 'rxjs';
import { HeaderService } from '~services/header/header.service';
import { IProductViewModel } from '~services/shop/shop.service';
import { ShopService } from '~services/shop/shop.service';

@Component( {
	selector: 'app-product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.scss'],
	providers: [HeaderService],
} )
export class ProductDetailsComponent implements OnInit {

	public constructor( private readonly route: ActivatedRoute, private readonly shopService: ShopService ) {
		this.route.params.subscribe( params => {
			this.shopService.geProductByName( params.identifier )
				.subscribe( product => {
					this.product.next( product );
					if ( product.customizableParts.length === 0 ) {
						this.allAttrsSelected.next( true );
					}
				} );
		} );
	}

	public get totalPrice() {
		return ShopService.getTotalPrice( this.product.value, this.choosenAttributes );
	}

	public product = new BehaviorSubject<IProductViewModel|undefined>( undefined );

	public choosenAttributes: _.Dictionary<string> = {};

	public allAttrsSelected = new BehaviorSubject<boolean>( false );

	public ngOnInit() {
		console.log( 'Go for details' );
	}

	public refreshAllProductsSelected() {
		this.allAttrsSelected.next( _.every( this.product.value.customizableParts, part => this.choosenAttributes[part.name] ) );
	}

	public addProductToCart() {
		this.shopService.addProductToCart( this.product.value, this.choosenAttributes );
	}
	public addSeparatePartToCart( part: IProduct.IPart ) {
		const attrId = this.choosenAttributes[part.name];
		const attributes: IAttribute & IEntityProperties = part.category.attributes as any;
		const attribute = attributes.find( attr => attr.uid === attrId );
		this.shopService.addAttributeToCart( attribute );
	}
}
