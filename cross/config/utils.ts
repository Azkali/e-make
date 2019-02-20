import { IUrlConfig } from './config-types';

export const makeAbsoluteUrl = ( config: IUrlConfig ) => {
	let url = `${config.scheme}://${config.fqdn}`;
	if(typeof config.port !== 'undefined'){
		url += `:${config.port}`;
	}
	return url + (config.baseurl || '');
}
