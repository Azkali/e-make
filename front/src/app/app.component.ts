import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { ShopService } from './shared/services/shop.service';
import { ICart, ITempCart } from '../../../cross/models/cart';
import { skip } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartComponent } from './pages/shop/cart/cart.component';
import { ModalService } from './shared/services/modal.service';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
} )


export class AppComponent {
	public title = 'app';

	public cartFlash = false;
	public cartInfos: BehaviorSubject<ITempCart>;

	public constructor( private modalService: ModalService, private shopService: ShopService ) {
		this.cartInfos = this.shopService.currentCart;
		this.cartInfos.pipe( skip( 1 ) ).subscribe( newCart => {
			this.cartFlash = true;
			setTimeout( () => this.cartFlash = false, 500 );
		} );
	}


	public initCartModal() {
		const inputs = {
		  isMobile: false,
		};
		this.modalService.init( CartComponent, inputs, {} );
	}

	public removeModal() {
		this.modalService.destroy();
	}
}
