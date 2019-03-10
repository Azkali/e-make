import { Component, OnInit } from '@angular/core';
import { concat, interval, of } from 'rxjs';
import { AsyncSubject } from 'rxjs/AsyncSubject';

import { map, takeWhile } from 'rxjs/operators';
import { UserService } from '~services/user/user.service';
import { WindowRef } from '~services/window-ref/window-ref.service';

enum ELoginStatus {
	LoggedIn,
	NotLoggedIn,
	ServerError,
}

@Component( {
	selector: 'app-after-login',
	templateUrl: './after-login.component.html',
	styleUrls: ['./after-login.component.scss'],
} )
export class AfterLoginComponent implements OnInit {
	public ELoginStatus = ELoginStatus;
	public loginStatus = new AsyncSubject<ELoginStatus>();
	public countdown = concat( of( -1 ), interval( 1000 ) ).pipe( map( t => 2 - t ), takeWhile( v => v >= 0 ) );

	public constructor( private readonly userService: UserService, private readonly winRef: WindowRef ) { }

	public ngOnInit() {
		this.userService.checkLogin().subscribe( token => {
			if ( token ) {
				this.loginStatus.next( ELoginStatus.LoggedIn );
			} else {
				this.loginStatus.next( ELoginStatus.NotLoggedIn );
			}
			this.loginStatus.complete();
			this.countdown.subscribe( undefined, undefined, () => this.winRef.nativeWindow.close() );
		} );
	}

}
