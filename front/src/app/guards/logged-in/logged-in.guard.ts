import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { UserService } from '~services/user/user.service';

@Injectable( {
	providedIn: 'root',
} )
export class LoggedInGuard implements CanActivate {
	public constructor( private readonly userService: UserService ) {}

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
					} ),
				);
		}
	}
