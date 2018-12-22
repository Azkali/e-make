import { IEntityProperties } from '@diaspora/diaspora/dist/types/types/entity';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { ShopService } from '../../../shared/services/shop/shop.service';
import { ITempCart, ICart } from '../../../../../../cross/models/cart';
import { skip } from 'rxjs/operators';
import { ModalService } from '../../../shared/services/modal/modal.service';
import { IAttribute } from '../../../../../../cross/models/attribute';
import { ICartItem } from '../../../../../../cross/models/cartItem';
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
				cartItem.item = await shopService.fetchCartItemContent( cartItem.item );
			} );
			await Promise.all( promises );
			console.log( newCart );
			this.cartInfos.next( newCart );
		} );
	}

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

	public close() {
		this.cartSubscription.unsubscribe();
		this.modalService.destroy();
	}
}
