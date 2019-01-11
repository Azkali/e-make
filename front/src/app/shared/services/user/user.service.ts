import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { first, map, catchError } from 'rxjs/operators';
import { Dictionary } from 'lodash';

import { makeAbsoluteUrl } from '../../../../../../cross/config/utils';
import { environment } from '../../../../environments/environment';

const BroadcastChannelPolyfill = require( 'broadcast-channel' ).default as {new( name: string ): BroadcastChannel};

@Injectable( {
	providedIn: 'root',
} )
export class UserService {
	private loginBroadcastEmit = new BroadcastChannelPolyfill( 'e-make' );
	private loginBroadcastReceive = new BroadcastChannelPolyfill( 'e-make' );
	private tokenSubject = new BehaviorSubject<string | undefined>( undefined );
	public token = this.tokenSubject.asObservable();

	public constructor( private httpClient: HttpClient ) {
		this.loginBroadcastReceive.onmessage = ( message: Dictionary<any> ) => {
			switch ( message.action ) {
				case 'login': {
					this.tokenSubject.next( message.token );
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
		return this.httpClient.get( statusUrl, { withCredentials: true } )
			.pipe(
				first(),
				map( ( res: {token: string} ) => {
					this.loginBroadcastEmit.postMessage( { action: 'login', token: res.token } );
					return [res.token, undefined];
				} ),
				catchError( err => of( [undefined, err] ) )
			);
	}
}
