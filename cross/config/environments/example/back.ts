import { IBackConfig } from '../../config-types';
import { config } from './common';

export const backConfig: IBackConfig = {
	authMethods: {
		github: {
			appId: 'the-app-id',
			appSecret: 'the-app-secret',
			redirectUrl: '/auth/github/callback',
		},
		google: {
			appId: 'the-app-id',
			appSecret: 'the-app-secret',
			redirectUrl: '/auth/google/callback',
		}
	},
	// Usually, you should bind every exposed interface.
	// Letting the OS guessing the network interface may allow to bind both ipv6 & ipv4.
	// https://github.com/nodejs/node/issues/18041#issuecomment-366601305
	//host: '0.0.0.0'
	sessionCookie: {
		domain: 'e-make.io',
		maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
	},
	tokenSecret: 'some-token',

	contactEmail: 'contact@mysite.com',
	mail: {
		mailBot: { name: 'Mail bot', email: 'a-bot@mysite.com' },
		quoteRecipients: [
			{ name: 'foo', email: 'foo@bar.qux' },
		],
		smtpAuth: false,
	},
	mailingList: {
		apiKey: 'a SendInBlue key',
		listId: 123,
	},

	common: config,
};
