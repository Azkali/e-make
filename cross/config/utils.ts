import { defaults } from 'lodash';
import { EScheme, IUrlConfig } from './config-types';

export const makeAbsoluteUrl = ( config: IUrlConfig ) => {
	const scheme = ( {
		[EScheme.Http]: 'http:',
		[EScheme.Https]: 'https:',
		[EScheme.Http | EScheme.Https]: '',
	} )[config.scheme];
	let url = `${scheme}//${config.fqdn}`;
	if ( typeof config.port !== 'undefined' ) {
		if ( !(
			( config.scheme === EScheme.Http && config.port === 80 ) || // Skip default HTTP port
			( config.scheme === EScheme.Https && config.port === 443 ) // Skip default HTTPS port
		) ) {
			url += `:${config.port}`;
		}
	}
	return url + ( config.baseurl || '' );
};
export const makeAbsoluteUrlsNoRelativeProtocol = ( config: IUrlConfig ) => {
	if ( config.scheme === ( EScheme.Http | EScheme.Https ) ) {
		return [
			makeAbsoluteUrl( defaults( { scheme: EScheme.Http }, config ) ),
			makeAbsoluteUrl( defaults( { scheme: EScheme.Https }, config ) ),
		];
	} else {
		return [makeAbsoluteUrl( config )];
	}
};
