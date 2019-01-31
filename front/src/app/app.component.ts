import { AnimationEvent } from '@angular/animations';
import { Component, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, zip } from 'rxjs';
import { skip, map, filter } from 'rxjs/operators';
import { assign } from 'lodash';

import { ITempCart } from '~models/cart';

import { ShopService } from '~services/shop/shop.service';
import { ModalService, EModalAnimation } from '~services/modal/modal.service';
import { HeaderService } from '~services/header/header.service';

import { hideShowOpacity, hideShowDisplay } from '~modals/modal.component';
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
		private ref: ChangeDetectorRef
	) {
		this.cartInfos = this.shopService.currentCart;
		this.cartInfos.pipe( skip( 1 ) ).subscribe( newCart => {
			this.cartFlash = true;
			setTimeout( () => this.cartFlash = false, 500 );
		} );

		// Manual changes detection to fix problem with animation state change not detected.
		this.modalService.modalVisibleState
			.pipe( skip( 1 ), filter( vs => !vs.done ) )
			.subscribe( () => setTimeout( () => this.ref.detectChanges(), 0 ) );
	}

	public title = 'app';

	public cartFlash = false;

	public get state() {
		return this.modalService.modalVisibleState;
	}

	public cartInfos: BehaviorSubject<ITempCart>;

	public modalAnimDone( event: AnimationEvent ) {
		this.modalService.modalAnimDone( event );
	}


	public openCartModal() {
		this.modalService.open( CartComponent, { isMobile: false }, {} );
	}
	public openMenuModal() {
		this.modalService.open( MenuComponent, { isMobile: false }, {} );
	}
}
