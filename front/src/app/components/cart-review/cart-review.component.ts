import { Component } from '@angular/core';
import { IEntityProperties } from '@diaspora/diaspora/dist/types/types/entity';
import { BehaviorSubject } from 'rxjs';

import { ShopService } from '~app/services/shop/shop.service';
import { ITempCart } from '~cross/models/cart';
import { ICartItem } from '~cross/models/cartItem';

@Component( {
  selector: 'app-cart-review',
  templateUrl: './cart-review.component.html',
  styleUrls: ['./cart-review.component.scss'],
} )
export class CartReviewComponent {

	public constructor(
		private readonly shopService: ShopService,
	) {
		this.shopService.currentCart.subscribe( async newCart => {
			const promises = newCart.items.map( async cartItem => {
				cartItem.item = await shopService.fetchCartItemContent( cartItem.item );
			} );
			await Promise.all( promises );
			this.cartInfos.next( newCart );
		} );
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

}
