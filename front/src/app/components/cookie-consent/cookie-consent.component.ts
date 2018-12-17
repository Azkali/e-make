import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output, Input, HostBinding, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';
import * as _ from 'lodash';

import { ACookieDependentService } from '../../shared/services/ICookieDependentService';
import { GoogleAnalyticsService } from './../../shared/services/google-analytics/google-analytics.service';
import { ShopService } from '../../shared/services/shop.service';

export type CookieLawPosition = 'top' | 'bottom';
export type CookieLawAnimation = 'topIn' | 'bottomIn' | 'topOut' | 'bottomOut';
export const translateInOut: AnimationTriggerMetadata =
trigger( 'transition', [
	state( '*', style( { transform: 'translateY(0)' } ) ),
	state( 'void', style( { transform: 'translateY(0)' } ) ),

	state( 'bottomOut', style( { transform: 'translateY(100%)' } ) ),
	state( 'topOut', style( { transform: 'translateY(-100%)' } ) ),

	transition( 'void => topIn', [
		style( { transform: 'translateY(-100%)' } ),
		animate( '1000ms ease-in-out' ),
	] ),

	transition( 'void => bottomIn', [
		style( { transform: 'translateY(100%)' } ),
		animate( '1000ms ease-in-out' ),
	] ),

	transition( 'bottomIn => bottomOut', animate( '1000ms ease-out' ) ),
	transition( 'topIn => topOut', animate( '1000ms ease-out' ) ),
] );

const DO_NOT_BOTHER = 'donotbother';

export interface IConsent {
	localCart: boolean;
	tracking: boolean;
	doNotBother: boolean;
}
@Component( {
	selector: 'app-cookie-consent',
	templateUrl: './cookie-consent.component.html',
	styleUrls: ['./cookie-consent.component.scss'],
	animations: [translateInOut],
	providers: [GoogleAnalyticsService],
} )
export class CookieConsentComponent implements AfterViewInit {
	@ViewChild( 'details' ) public details?: ElementRef<HTMLDivElement>;
	@ViewChild( 'copy' ) public copy?: ElementRef<HTMLDivElement>;

	public detailsHeight?: number;
	public copyHeight?: number;

	public showDetails = false;

	public get bottomPos() {
		return -( this.showDetails ? 0 : this.detailsHeight ) + 'px';
	}

	public hasAccepted = new EventEmitter<IConsent>();

	@HostBinding( 'class.cookie-law' )
	public cookieLawClass: boolean;

	@Output()
	public isSeen = new EventEmitter<boolean>();

	public get acceptLabel() {
		return _.every( this.consentMatrice ) ? 'Accept all' : 'Save';
	}

	public consentMatrice: IConsent;

	@Input()
	public get position() { return this._position; }
	public set position( value: CookieLawPosition ) {
		this._position = ( value !== null && `${value}` !== 'false' && ( `${value}` === 'top' || `${value}` === 'bottom' ) ) ? value : 'bottom';
	}
	private _position: CookieLawPosition;

	public transition: CookieLawAnimation;



	public constructor(
		private shopService: ShopService,
		private googleAnalytics: GoogleAnalyticsService
	) {
		this.consentMatrice = {
			localCart: this.shopService.cookieAccepted,
			tracking: this.googleAnalytics.cookieAccepted,
			doNotBother: false,
		};
		this.consentMatrice.doNotBother = this.consentMatrice.localCart ||
			this.consentMatrice.tracking ||
			ACookieDependentService.hasCookie( DO_NOT_BOTHER );
		this._position =  'bottom';
		if ( _.every( _.values( this.consentMatrice ), v => !v ) ) {
			this.transition = 'bottomIn';
			this.consentMatrice = {
				localCart: true,
				tracking: true,
				doNotBother: true,
			};
		} else {
			this.transition = 'bottomOut';
		}
		this.cookieLawClass = true;
	}


	public applyPreferences() {
		console.log( 'Apply preferences', this.consentMatrice );
		this.hasAccepted.emit( this.consentMatrice );
		this.dismiss();
	}

	public afterDismissAnimation( evt: any ): void {
		if ( evt.toState === 'topOut' ||
		evt.toState === 'bottomOut' ) {
			this.isSeen.emit( true );
		}
	}

	public dismiss(): void {
		this.transition = this.position === 'top' ? 'topOut' : 'bottomOut';
	}

	@HostListener( 'window:resize', ['$event'] )
	private refreshSizes() {
		this.detailsHeight = this.details ? this.details.nativeElement.offsetHeight : undefined;
		this.copyHeight = this.copy ? this.copy.nativeElement.offsetHeight : undefined;
	}

	public ngAfterViewInit() {
		window.setTimeout( () => this.refreshSizes() );
		this.hasAccepted.subscribe( ( accepted: IConsent ) => {
			this.googleAnalytics.cookieAccepted = accepted.tracking;
			this.shopService.cookieAccepted = accepted.localCart;
			if ( !accepted.tracking && !accepted.localCart ) {
				if ( accepted.doNotBother ) {
					ACookieDependentService.setCookie( DO_NOT_BOTHER, 'y' );
				} else {
					ACookieDependentService.deleteCookie( DO_NOT_BOTHER );
				}
			}
		} );
	}
}
