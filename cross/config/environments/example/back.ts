import { IBackConfig } from '../../config-types';
import { config } from './common';

export const backConfig: IBackConfig = {
	oauth: {
		google: {
			appId: "the-app-id",
			appSecret:"the-app-secret",
			redirectUrl: "/auth/google/callback",
		},
	},
	host: "0.0.0.0",
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
