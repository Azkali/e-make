import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { first, map, catchError } from 'rxjs/operators';
import { Dictionary } from 'lodash';

import { makeAbsoluteUrl } from '../../../../../../cross/config/utils';
import { environment } from '../../../../environments/environment';

const BroadcastChannelPolyfill = require( 'broadcast-channel' ).default as {new( name: string ): BroadcastChannel};

const makeChan = () => new BroadcastChannelPolyfill( 'e-make' );

@Injectable( {
	providedIn: 'root',
} )
export class UserService {
	private loginBroadcastEmit = makeChan();
	private loginBroadcastReceive = makeChan();
	private token = new BehaviorSubject<string | undefined>( undefined );

	public constructor( private httpClient: HttpClient ) {
		this.loginBroadcastReceive.onmessage = ( message: Dictionary<any> ) => {
			console.log( 'Message received', message );
			switch ( message.action ) {
				case 'login': {
					this.token.next( message.token );
				}
			}
		};
		this.loginBroadcastReceive.onmessageerror = ( message: Dictionary<any> ) => {
			console.log( 'Message error received', message );
		};
		this.loginBroadcastEmit.postMessage( { action: 'init' } );
	}

	public checkLogin() {
		const statusUrl = `${makeAbsoluteUrl( environment.common.back )}${environment.common.back.auth.baseAuthRoute}/status`;
		return this.httpClient.get( statusUrl, { withCredentials: true } )
			.pipe(
				first(),
				map( ( res: {token: string} ) => {
					console.log( 'Login done' );
					this.loginBroadcastEmit.postMessage( { action: 'login', token: res.token } );
					return [res.token, undefined];
				} ),
				catchError( err => of( [undefined, err] ) )
			);
	}
}
