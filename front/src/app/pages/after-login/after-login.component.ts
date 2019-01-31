import { AsyncSubject } from 'rxjs/AsyncSubject';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { WindowRef } from '~services/window-ref/window-ref.service';
import { UserService } from '~services/user/user.service';

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

	public constructor( private userService: UserService, private winRef: WindowRef ) { }

	public ngOnInit() {
		this.userService.checkLogin().subscribe( token => {
			if ( token ) {
				this.loginStatus.next( ELoginStatus.LoggedIn );
				timer( 3000 ).subscribe( () => {
					this.winRef.nativeWindow.close();
				} );
			} else {
				this.loginStatus.next( ELoginStatus.NotLoggedIn );
			}
			this.loginStatus.complete();
		} );
	}

}
