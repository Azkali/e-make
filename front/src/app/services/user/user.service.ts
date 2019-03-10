import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Dictionary, isObject, isString } from 'lodash';
import { BehaviorSubject, from, Observable, throwError, of } from 'rxjs';
import { first, skip, switchMap, map, catchError } from 'rxjs/operators';

import { ModalService } from '~services/modal/modal.service';

import { makeAbsoluteUrl } from '~cross/config/utils';

import { environment } from '~environments/environment';

import { LoginComponent } from '~app/modals/login/login.component';

const BroadcastChannelPolyfill = require( 'broadcast-channel' ).default as new( name: string ) => BroadcastChannel;
const hasToken = (val: unknown): val is {token: string} => val instanceof Object && 'token' in val &&
	isString( ( val as { token: unknown } ).token ) && ( val as { token: string } ).token.length > 0;

@Injectable( {
	providedIn: 'root',
} )
export class UserService {
	private loginBroadcastEmit = new BroadcastChannelPolyfill( 'e-make' );
	private loginBroadcastReceive = new BroadcastChannelPolyfill( 'e-make' );
	private tokenSubject = new BehaviorSubject<string | undefined>( undefined );
	public token = this.tokenSubject.asObservable();
	public isAuthenticated = this.tokenSubject.pipe( map( token => !!token ) );
	private targetRoute?: string[];

	public constructor(
		private httpClient: HttpClient,
		private router: Router,
		private modalService: ModalService
	) {
		this.token.subscribe(console.log.bind(console, 'Token state'))
		this.isAuthenticated.subscribe(console.log.bind(console, 'IsAuthenticated state'))
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

	private retrieveToken(): Observable<string> {
		const statusUrl = `${makeAbsoluteUrl( environment.common.back )}${environment.common.back.auth.baseAuthRoute}/status`;
		console.log('Retrieving token', statusUrl);
		return this.httpClient.get<unknown>( statusUrl, { withCredentials: true } )
			.pipe(
				first(),
				switchMap( res => {
					if( hasToken( res ) ){
						return of(res.token)
					} else {
						return throwError( new TypeError( 'The response did not contained a token.' ))
					}
				} ),
				switchMap( token => {
					console.info( 'The user is authenticated with token', token )
					this.loginBroadcastEmit.postMessage( { action: 'login', token } );
					this.tokenSubject.next( token );
					return this.token;
				} ),
				catchError( err => {
					console.error( 'Error during login check:', err );
					this.tokenSubject.next( undefined );
					return this.token;
				} ) );
	}

	/**
	 * @deprecated
	 */
	public checkLogin(): Observable<string> {
		return this.retrieveToken();
	}
	
	public logout(): Observable<void> {
		return throwError(new Error('Not implemented'));
	}

	public openLogin( targetRoute?: string[], immediate = false ): Observable<void> {
		this.targetRoute = targetRoute;
		return this.modalService.open( LoginComponent, undefined, undefined, undefined, immediate );
	}

	public openLoginForSecuredRoute( targetRoute: string[], immediate = false ): Observable<void> {
		return from( this.router.navigate( ['index'] ) )
			.pipe(
				first(),
				switchMap( () => this.openLogin( targetRoute, immediate ) )
			);
	}
}

