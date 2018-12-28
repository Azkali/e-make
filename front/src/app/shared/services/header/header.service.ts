import { Injectable } from '@angular/core';

@Injectable( {
	providedIn: 'root',
} )
export class HeaderService {
	public get headerClasses() {
		return undefined;
	}
	public get headerStyles() {
		return undefined;
	}
	public constructor() { }
}
