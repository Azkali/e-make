import { config } from './common';
export const backConfig = Object.assign( {
		oauth: {
			google: {
				appId: "the-app-id",
				appSecret:"the-app-secret",
				redirectUrl: "/auth/google/callback"
			},
		},
		host: "0.0.0.0",
		tokenSecret: "some-token",
	},
	{ common: config }
);
