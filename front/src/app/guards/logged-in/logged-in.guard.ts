import { ModalService } from './../../services/modal/modal.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap, filter, first } from 'rxjs/operators';

import { UserService } from '~services/user/user.service';

@Injectable( {
	providedIn: 'root',
} )
export class LoggedInGuard implements CanActivate {
	public constructor( private userService: UserService ) {}

	public canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot ): Observable<boolean> {
			return this.userService.checkLogin()
				.pipe(
					map( token => !!token ),
					map( loggedIn => {
						if ( loggedIn ) {
							return true;
						} else {
							const route = state.url.split( /\//g ).filter( v => !!v );
							this.userService.openLoginForSecuredRoute( route, true ).pipe( first() ).subscribe();
							return false;
						}
					} )
				);
		}
	}

