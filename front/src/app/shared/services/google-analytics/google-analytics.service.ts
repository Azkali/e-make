/// <reference types="@types/google.analytics"/>

import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import { ACookieDependentService } from './../ICookieDependentService';
import { environment } from './../../../../environments/environment';

@Injectable()
export class GoogleAnalyticsService extends ACookieDependentService {
	private hasLoadedScript = false;

	public get cookieAccepted() {
		return ACookieDependentService.hasCookie( '_ga' );
	}
	public set cookieAccepted( enabled: boolean ) {
		if ( enabled ) {
			console.info( 'Enabling Google Analytics' );
			this.loadTrackingCode();
			this.router.events.subscribe( event => {
				try {
					if ( typeof ga === 'function' ) {
						if ( event instanceof NavigationEnd ) {
							ga( 'set', 'page', event.urlAfterRedirects );
							ga( 'send', 'pageview' );
							console.log( '%%% Google Analytics page view event %%%' );
						}
					} else {
						console.error( 'Missing Google Analytics script!' );
					}
				} catch ( e ) {
					console.log( e );
				}
			} );
		} else {
			console.info( 'Removing cookies' );
			GoogleAnalyticsService.deleteCookie( '_ga' );
			GoogleAnalyticsService.deleteCookie( '_gid' );
		}
	}

	public constructor( public router: Router ) {
		super();
	}


	/**
	 * Emit google analytics event
	 * Fire event example:
	 * this.emitEvent("testCategory", "testAction", "testLabel", 10);
	 */
	public emitEvent(
		eventCategory: string,
		eventAction: string,
		eventLabel?: string,
		eventValue?: number
	) {
		if ( typeof ga === 'function' ) {
			ga( 'send', 'event', {
				eventCategory: eventCategory,
				eventLabel: eventLabel,
				eventAction: eventAction,
				eventValue: eventValue,
			} );
		}
	}

	private loadTrackingCode() {
		if ( this.hasLoadedScript ) {
			return;
		}

		try {
			const script = document.createElement( 'script' );
			script.innerHTML = `
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
			ga('create', '${environment.googleAnalyticsKey}', 'auto');
			`;
			document.head.appendChild( script );
			this.hasLoadedScript = true;
		} catch ( ex ) {
			console.error( 'Error appending google analytics' );
			console.error( ex );
		}
	}
}
