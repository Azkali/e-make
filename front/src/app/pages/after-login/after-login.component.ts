import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Component, OnInit } from '@angular/core';
import { interval, BehaviorSubject, concat, of } from 'rxjs';

import { WindowRef } from '~services/window-ref/window-ref.service';
import { UserService } from '~services/user/user.service';
import { map, takeWhile } from 'rxjs/operators';

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

	public constructor( private userService: UserService, private winRef: WindowRef ) { }

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
