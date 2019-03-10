import { escapeRegExp, isNil } from 'lodash';

export interface ICookieDependentService {
	cookieAccepted: boolean;
}
export abstract class ACookieDependentService implements ICookieDependentService {
	public abstract get cookieAccepted();
	public abstract set cookieAccepted( accepted: boolean );

	public static deleteCookie( name: string ) {
		document.cookie = `${name}=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	}
	public static hasCookie( name: string ) {
		return !isNil( ACookieDependentService.getCookie( name ) );
	}
	public static getCookie( name: string ) {
		const cookieMatchRegex = new RegExp( `^(.*;)?\\s*${escapeRegExp( name )}\\s*=\\s*([^;]+)(.*)?$` );
		const cookieMatch = document.cookie.match( cookieMatchRegex );
		if ( cookieMatch ) {
			return cookieMatch[2];
		}
		return undefined;
	}
	public static setCookie( name: string, value: string, expiresIn: number = 13 * 30 * 24 * 60 * 60 * 1000 ) {
		const now = new Date();
		const time = now.getTime();
		const expireTime = time + expiresIn;
		now.setTime( expireTime );
		document.cookie = `${name}=${value};expires=${now.toUTCString()};path=/`;
	}
}
