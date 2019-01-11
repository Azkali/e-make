import { AsyncSubject } from 'rxjs/AsyncSubject';
import { WindowRef } from './../../shared/window-ref/window-ref.service';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './../../shared/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { makeAbsoluteUrl } from '../../../../../cross/config/utils';
import { first } from 'rxjs/operators';
import { timer } from 'rxjs';

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
		this.userService.checkLogin().subscribe( ( [token, error] ) => {
			if ( token ) {
				this.loginStatus.next( ELoginStatus.LoggedIn );
				timer( 3000 ).subscribe( () => {
					this.winRef.nativeWindow.close();
				} );
			}
			if ( error instanceof HttpErrorResponse ) {
				if ( error.status === 401 ) {
					this.loginStatus.next( ELoginStatus.NotLoggedIn );
				} else {
					this.loginStatus.next( ELoginStatus.ServerError );
				}
			}
			this.loginStatus.complete();
		} );
	}

}
