export enum EScheme{
	Http = 'http',
	Https = 'https',
}
export interface IUrlConfig{
	fqdn: string;
	scheme: EScheme;
	port?: number,
	baseurl?: string;
};

export const makeAbsoluteUrl = ( config: IUrlConfig ) => {
	let url = `${config.scheme}://${config.fqdn}`;
	if(typeof config.port !== 'undefined'){
		url += `:${config.port}`;
	}
	return url + (config.baseurl || '');
}
