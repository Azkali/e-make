import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { first, filter, map, mergeMap } from 'rxjs/operators';
import { Dictionary, castArray, Many, times, stubTrue, zipObject } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';

interface IHeaderData {
	classes: Many<string>;
	styles: Dictionary<string>;
}

@Injectable( {
	providedIn: 'root',
} )
export class HeaderService {
	public headerClasses = new BehaviorSubject<Dictionary<boolean>>( {alt:true} );
	public headerStyles = new BehaviorSubject<Dictionary<string>>( {} );

	public constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.router.events
			.pipe(
				filter( ( event ) => event instanceof NavigationEnd ),
				map( () => this.activatedRoute ),
				map( ( route ) => {
					while ( route.firstChild ) { route = route.firstChild; }
					return route;
				} ),
				mergeMap( ( route ) => route.data as Observable<IHeaderData> )
			).subscribe( ( data ) => {
				const classes = castArray( data.classes || 'alt' );
				this.headerClasses.next( zipObject( classes, times( classes.length, stubTrue ) ) );
				this.headerStyles.next( data.styles );
			} );
	}
}
