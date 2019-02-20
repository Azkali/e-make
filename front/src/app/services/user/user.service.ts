import { ModalService } from '~services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { first, skip, switchMap, map } from 'rxjs/operators';
import { Dictionary } from 'lodash';

import { makeAbsoluteUrl } from '~cross/config/utils';
import { environment } from '~environments/environment';
import { Router } from '@angular/router';
import { LoginComponent } from '~app/modals/login/login.component';

const BroadcastChannelPolyfill = require( 'broadcast-channel' ).default as new( name: string ) => BroadcastChannel;

@Injectable( {
	providedIn: 'root',
} )
export class UserService {
	private loginBroadcastEmit = new BroadcastChannelPolyfill( 'e-make' );
	private loginBroadcastReceive = new BroadcastChannelPolyfill( 'e-make' );
	private tokenSubject = new BehaviorSubject<string | undefined>( undefined );
	public token = this.tokenSubject.asObservable();
	private targetRoute?: string[];

	public constructor(
		private httpClient: HttpClient,
		private router: Router,
		private modalService: ModalService
	) {
		this.loginBroadcastReceive.onmessage = async ( message: Dictionary<any> ) => {
			switch ( message.action ) {
				case 'login': {
					if ( message.token ) {
						LoginComponent.closeLoginModal.next( undefined );
					}
					this.tokenSubject.next( message.token );
					console.log( {message, targetRoute: this.targetRoute} );
					if ( this.targetRoute ) {
						await this.router.navigate( this.targetRoute );
						this.targetRoute = undefined;
					}
				}
			}
		};
		this.loginBroadcastReceive.onmessageerror = ( message: Dictionary<any> ) => {
			console.error( 'A broadcast channel errored:', message );
		};
		this.loginBroadcastEmit.postMessage( { action: 'init' } );
	}

	public checkLogin() {
		const statusUrl = `${makeAbsoluteUrl( environment.common.back )}${environment.common.back.auth.baseAuthRoute}/status`;
		this.httpClient.get( statusUrl, { withCredentials: true } )
			.pipe( first() )
			.subscribe(
				( res: {token?: string} ) => {
					this.loginBroadcastEmit.postMessage( { action: 'login', token: res.token } );
					if ( res.token ) {
						LoginComponent.closeLoginModal.next( undefined );
					}
				},
				err => {
					console.error( 'Error during login check:', err );
					this.tokenSubject.next( undefined );
				} );
		return this.token.pipe( skip( 1 ) );
	}

	public openLogin( targetRoute?: string[], immediate = false ) {
		this.targetRoute = targetRoute;
		return this.modalService.open( LoginComponent, undefined, undefined, undefined, immediate );
	}

	public openLoginForSecuredRoute( targetRoute: string[], immediate = false ) {
		return from( this.router.navigate( ['index'] ) )
			.pipe(
				first(),
				switchMap( () => this.openLogin( targetRoute, immediate ) )
			);
	}
}

