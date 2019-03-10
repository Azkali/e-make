import { IBackConfig } from '../../config-types';
import { config } from './common';

export const backConfig: IBackConfig = {
	authMethods: {
		github: {
			appId: "the-app-id",
			appSecret:"the-app-secret",
			redirectUrl: "/auth/google/callback",
		},
		google: {
			appId: "the-app-id",
			appSecret:"the-app-secret",
			redirectUrl: "/auth/google/callback",
		},
	},
	host: "0.0.0.0",
	sessionCookie: {
		domain: 'e-make.io',
		maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
	},
	tokenSecret: "some-token",
	mail: {
		quoteRecipients: [
			{ name: 'foo', email: 'foo@bar.qux' },
		],
		smtpAuth: false,
		mailBot: { name: 'Mail bot', email: 'a-bot@mysite.com' }
	},
	contactEmail: 'contact@mysite.com',
	mailingList: {
		apiKey: 'a SendInBlue key',
		listId: 123,
	},
	common: config,
};
