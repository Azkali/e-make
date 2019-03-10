import { Component } from '@angular/core';
import { IEntityProperties } from '@diaspora/diaspora/dist/types/types/entity';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { ITempCart } from '~models/cart';
import { ICartItem } from '~models/cartItem';

import { ModalComponent } from '~modals/modal.component';

import { Router } from '@angular/router';
import { ModalService } from '~services/modal/modal.service';
import { ShopService } from '~services/shop/shop.service';
import { UserService } from '~services/user/user.service';

@Component( {
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss'],
} )
export class CartComponent extends ModalComponent {

	public constructor(
		modalService: ModalService,
		private readonly shopService: ShopService,
		private readonly userService: UserService,
		private readonly router: Router,
	) {
		super( modalService );
		this.subscriptions.push( this.shopService.currentCart.subscribe( async newCart => {
			const promises = newCart.items.map( async cartItem => {
				cartItem.item = await shopService.fetchCartItemContent( cartItem.item );
			} );
			await Promise.all( promises );
			console.log( newCart );
			this.cartInfos.next( newCart );
		} ) );
	}
	public cartInfos = new BehaviorSubject<ITempCart>( { items: [], totalCount: 0, totalSum: 0 } );

	public trackCartItem( index: number, cartItem: ICartItem & IEntityProperties ) {
		return cartItem.id;
	}

	public async setCartItemCount( cartItem: ICartItem & IEntityProperties, count: number ) {
		await this.shopService.setCartItemCount( cartItem, count );
	}

	public async deleteCartItem( cartItem: ICartItem & IEntityProperties ) {
		await this.shopService.deleteCartItem( cartItem );
	}

	public getTotalPriceCartItem( cartItem: ICartItem ) {
		/*if ( cartItem.item.hasOwnProperty( 'attributeUid' ) ) {
			return cartItem.count * cartItem.unitPrice;
		} else {
			const item =
			return ShopService.getTotalPrice( cartItem.item.product, cartItem.item.attributeUids );l;
		}*/
	}

	public buy() {
		const subscription =  this.userService.checkLogin()
			.subscribe( token => {
				console.log( token );
				if ( !token ) {
					this.openLoginModal();
				} else {
					setTimeout( () => {
						this.subscriptions = this.subscriptions.filter( sub => sub !== subscription );
						subscription.unsubscribe();
					},          0 );
					this.doBuy();
				}
			} );
		this.subscriptions.push( subscription );
	}

	private openLoginModal() {
		this.userService.openLogin().pipe( first() ).subscribe();
	}

	private doBuy() {
		console.log( 'do Buy' );
		this.router.navigate( ['order'] );
	}
}
