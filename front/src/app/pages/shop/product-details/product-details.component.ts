import { IEntityProperties, EntityUid } from '@diaspora/diaspora/dist/types/types/entity';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, AsyncSubject } from 'rxjs';
import * as _ from 'lodash';

import { IProductViewModel } from './../../../shared/services/shop.service';
import { ShopService } from '../../../shared/services/shop.service';
import { IAttribute } from '../../../../../../cross/models/attribute';
import { IProduct } from '../../../../../../cross/models/product';

@Component( {
	selector: 'app-product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.scss'],
} )
export class ProductDetailsComponent implements OnInit {

	public constructor( private route: ActivatedRoute, private shopService: ShopService ) {
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

	public choosenAttributes: _.Dictionary<EntityUid> = {};

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
		const attribute = attributes.find( attr => attr.id === attrId );
		console.log( {attrId, attributes, attribute} );
		this.shopService.addAttributeToCart( attribute );
	}
}
