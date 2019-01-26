import { BehaviorSubject, zip } from 'rxjs';
import { Component } from '@angular/core';
import { skip, map } from 'rxjs/operators';
import { assign } from 'lodash';

import { ITempCart } from '~models/cart';

import { ShopService } from '~services/shop/shop.service';
import { UserService } from '~services/user/user.service';
import { ModalService } from '~services/modal/modal.service';
import { HeaderService } from '~services/header/header.service';

import { hideShowOpacity, hideShowDisplay, EModalAnimation } from '~modals/modal.component';
import { CartComponent } from '~modals/cart/cart.component';
import { MenuComponent } from '~modals/menu/menu.component';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [HeaderService],
	animations: [hideShowOpacity, hideShowDisplay],
} )
export class AppComponent {

	public get headerClasses() {
		return zip( this.headerService.headerClasses, this.modalService.backgroundBlurred )
			.pipe( map( ( [classes, backgroundBlurred] ) =>
				assign( classes , {blurred: backgroundBlurred, blurrable: true} ) ) );
	}

	public get headerStyles() {
		return this.headerService.headerStyles;
	}

	public constructor(
		private modalService: ModalService,
		private shopService: ShopService,
		private headerService: HeaderService,
		private userService: UserService
	) {
		this.cartInfos = this.shopService.currentCart;
		this.cartInfos.pipe( skip( 1 ) ).subscribe( newCart => {
			this.cartFlash = true;
			setTimeout( () => this.cartFlash = false, 500 );
		} );
		this.modalService.modalVisibleState.subscribe( visible => {
			this.changeState( visible ? EModalAnimation.Shown : EModalAnimation.Hidden );
		} );
	}
	public title = 'app';

	public cartFlash = false;

	public state = EModalAnimation.Hidden;
	public cartInfos: BehaviorSubject<ITempCart>;



	private changeState( newState: EModalAnimation ) {
		this.state = newState;
	}
	public modalAnimDone( event ) {
		if ( event.fromState === EModalAnimation.Shown && event.toState === EModalAnimation.Hidden ) {
			this.modalService.removeModalElement();
		}
	}


	public openCartModal() {
		this.modalService.open( CartComponent, { isMobile: false }, {} );
	}
	public openMenuModal() {
		this.modalService.open( MenuComponent, { isMobile: false }, {} );
	}
}
