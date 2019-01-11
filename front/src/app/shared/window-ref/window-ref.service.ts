import { Injectable } from '@angular/core';

function _window() {
	// return the global native browser window object
	return typeof window !== 'undefined' ? window : undefined;
}

@Injectable( {
	providedIn: 'root',
} )
export class WindowRef {
	public get nativeWindow() {
		return _window();
	}
}
