import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { ShopService } from './shared/services/shop/shop.service';
import { ICart, ITempCart } from '../../../cross/models/cart';
import { skip } from 'rxjs/operators';
import { CartComponent } from './pages/shop/cart/cart.component';
import { ModalService } from './shared/services/modal/modal.service';
import { HeaderService } from './shared/services/header/header.service';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [HeaderService],
} )
export class AppComponent {
	public title = 'app';

	public cartFlash = false;
	public cartInfos: BehaviorSubject<ITempCart>;

	public get headerClasses() {
		return this.headerService.headerClasses;
	}

	public get headerStyles() {
		return this.headerService.headerStyles;
	}

	public constructor(
		private modalService: ModalService,
		private shopService: ShopService,
		private headerService: HeaderService
	) {
		this.cartInfos = this.shopService.currentCart;
		this.cartInfos.pipe( skip( 1 ) ).subscribe( newCart => {
			this.cartFlash = true;
			setTimeout( () => this.cartFlash = false, 500 );
		} );

		this.headerClasses.subscribe( console.log.bind( console, 'Changed header classes' ) );
		this.headerStyles.subscribe( console.log.bind( console, 'Changed header styles' ) );
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
