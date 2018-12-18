import { BehaviorSubject, Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { ShopService } from '../../../shared/services/shop.service';
import { ITempCart } from '../../../../../../cross/models/cart';
import { skip } from 'rxjs/operators';
import { ModalService } from '../../../shared/services/modal.service';
import { IAttribute } from '../../../../../../cross/models/attribute';
@Component( {
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss'],
} )
export class CartComponent {
	public cartInfos = new BehaviorSubject<ITempCart>( {items: [], totalCount: 0, totalSum: 0} );
	private cartSubscription: Subscription;

	public constructor( private modalService: ModalService, private shopService: ShopService ) {
		this.cartSubscription = this.shopService.currentCart.subscribe( async newCart => {
			const promises = newCart.items.map( async cartItem => {
				cartItem.item = await shopService.fetchItem( cartItem.item );
			} );
			await Promise.all( promises );
			console.log( newCart );
			this.cartInfos.next( newCart );
		} );
	}

	public close() {
		this.cartSubscription.unsubscribe();
		this.modalService.destroy();
	  }
}
