import { BehaviorSubject, zip } from 'rxjs';
import { Component } from '@angular/core';
import { ShopService } from './shared/services/shop/shop.service';
import { ICart, ITempCart } from '../../../cross/models/cart';
import { skip, map } from 'rxjs/operators';
import { CartComponent } from './pages/shop/cart/cart.component';
import { ModalService } from './shared/services/modal/modal.service';
import { HeaderService } from './shared/services/header/header.service';
import { hideShowOpacity, hideShowDisplay, EModalAnimation } from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { assign } from 'lodash';

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
		private headerService: HeaderService
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
		this.modalService.open( NavbarComponent, { isMobile: false }, {} );
	}
}
