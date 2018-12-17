import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { ShopService } from '../../../shared/services/shop.service';
import { ICart } from '../../../../../../cross/models/cart';
import { skip } from 'rxjs/operators';
import { ModalService } from '../../../shared/services/modal.service';
@Component( {
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss'],
} )
export class CartComponent {
	public cartFlash = false;
	public cartInfos: BehaviorSubject<ICart>;

	public constructor( private modalService: ModalService, private shopService: ShopService ) {
		this.cartInfos = this.shopService.currentCart;
		this.cartInfos.pipe( skip( 1 ) ).subscribe( newCart => {
			this.cartFlash = true;
			setTimeout( () => this.cartFlash = false, 500 );
		} );
	}

	public close() {
		this.modalService.destroy();
	  }
}
