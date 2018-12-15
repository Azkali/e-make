export const backConfig = require( '../../cross/config/local/back.json' ) as {
	port: number;
	domainName: string;
	tokenSecret: string;
	host: string;
};
export const frontConfig = require( '../../cross/config/local/front.json' ) as {
	port?: number;
	domainName: string;
};
export const commonConfig = require( '../../cross/config/local/common.json' ) as {
	production: boolean;
};
export const oauthConfigGoogle = require( '../../cross/config/local/oauth-id.json' ) as {
	appId: string;
	appSecret: string;
	redirectUrl: string;
};
