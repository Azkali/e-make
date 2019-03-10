/// <reference types="@types/google.analytics"/>

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, skip } from 'rxjs/operators';

import { environment } from '~environments/environment';

import { ACookieDependentService } from '~services/ICookieDependentService';

@Injectable()
export class GoogleAnalyticsService extends ACookieDependentService {
	private hasLoadedScript = false;

	public get cookieAccepted() {
		return ACookieDependentService.hasCookie( '_ga' );
	}
	public set cookieAccepted( enabled: boolean ) {
		if ( enabled ) {
			this.bootstrapGoogleAnalytics();
		} else {
			GoogleAnalyticsService.deleteCookie( '_ga' );
			GoogleAnalyticsService.deleteCookie( '_gid' );
		}
	}

	private bootstrapGoogleAnalytics() {
		if ( environment.googleAnalyticsKey ) {
			console.info( 'Enabling Google Analytics' );
			this.loadTrackingCode();
		} else {
			console.info( 'Enabling Google Analytics, but it is disabled by config' );
		}
		this.router.events.pipe( filter( event => event instanceof NavigationEnd ), skip( 1 ) ).subscribe( ( event: NavigationEnd ) => {
			try {
				if ( typeof ga === 'function' ) {
					ga( 'set', 'page', event.urlAfterRedirects );
					ga( 'send', 'pageview' );
				} else {
					console.warn( 'Missing Google Analytics script!' );
				}
			} catch ( e ) {
				console.error( e );
			}
			console.log( '%%% Google Analytics page view event %%%' );
		} );
	}

	public constructor( public router: Router ) {
		super();
		if ( this.cookieAccepted ) {
			this.bootstrapGoogleAnalytics();
		}
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
		eventValue?: number ) {
		if ( typeof ga === 'function' ) {
			ga( 'send', 'event', {
				eventCategory,
				eventLabel,
				eventAction,
				eventValue,
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

ga('create','${environment.googleAnalyticsKey}','auto');`;
			document.head.appendChild( script );
			this.hasLoadedScript = true;
		} catch ( ex ) {
			console.error( 'Error appending google analytics' );
			console.error( ex );
		}
	}
}
