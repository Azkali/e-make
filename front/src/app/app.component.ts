import { AnimationEvent } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { assign } from 'lodash';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { delayWhen, filter, first, map, skip } from 'rxjs/operators';

import { ITempCart } from '~models/cart';

import { HeaderService } from '~services/header/header.service';
import { IVisibleState, ModalService } from '~services/modal/modal.service';
import { ShopService } from '~services/shop/shop.service';

import { NavigationStart, Router } from '@angular/router';
import { CartComponent } from '~modals/cart/cart.component';
import { MenuComponent } from '~modals/menu/menu.component';
import { hideShowDisplay, hideShowOpacity } from '~modals/modal.component';
import { DomService } from './services/dom/dom.service';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [HeaderService],
	animations: [hideShowOpacity, hideShowDisplay],
} )
export class AppComponent implements AfterViewInit {
	private readonly initialized = new AsyncSubject<void>();

	public get headerClasses() {
		return zip( this.headerService.headerClasses, this.modalService.backgroundBlurred )
			.pipe( map( ( [classes, backgroundBlurred] ) =>
				assign( classes , { blurred: backgroundBlurred, blurrable: true } ) ) );
	}

	public get headerStyles() {
		return this.headerService.headerStyles;
	}
	public get backgroundBlurred() {
		return this.modalService.backgroundBlurred;
	}

	public constructor(
		private readonly modalService: ModalService,
		private readonly shopService: ShopService,
		private readonly headerService: HeaderService,
		private readonly domService: DomService,
		private readonly router: Router,
		private readonly ref: ChangeDetectorRef,
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

		// try to fix `Expression has changed after it was checked`
		// this.initialized.subscribe( () => setTimeout( () => this.ref.detectChanges(), 0 ) );
		this.state = this.modalService.modalVisibleState
			.pipe( skip( 1 ), delayWhen( () => this.initialized ) );

		this.router.events
			.pipe( filter( e => e instanceof NavigationStart ) )
			.subscribe( event => {
				this.modalService.close();
			} );
	}

	public title = 'app';

	public cartFlash = false;

	public state: Observable<IVisibleState>;

	public cartInfos: BehaviorSubject<ITempCart>;

	public modalAnimDone( event: AnimationEvent ) {
		this.modalService.modalAnimDone( event );
	}

	public openCartModal() {
		this.modalService.open( CartComponent, { isMobile: false }, {} ).pipe( first() ).subscribe();
	}
	public openMenuModal() {
		this.modalService.open( MenuComponent, { isMobile: false }, {} ).pipe( first() ).subscribe();
	}

	public ngAfterViewInit() {
		this.initialized.complete();
	}

	@HostListener( 'window:keyup', ['$event'] )
	public keyEvent( event: KeyboardEvent ) {
		if ( event.key === 'Escape' && this.domService.focusedElement !== null ) {
			this.modalService.close();
		}
	}
}
