export enum EScheme {
	Http = 1,
	Https = 2,
}
export interface IUrlConfig {
	fqdn: string;
	scheme: EScheme;
	port?: number;
	baseurl?: string;
}

export interface ICommonConfig {
	back: IUrlConfig & {
		auth: ICommonConfig.IBackAuthPathConfig;
		apiBaseUrl: string;
	};
	front: IUrlConfig & {
		afterAuthRoute: string;
	};
	production: boolean;
}
export namespace ICommonConfig {
	export interface IBackAuthPathConfig {
		baseAuthRoute: string;
		availableMethods: Array<keyof IBackConfig.IAuthMethodsConfig>;
	}
}

export interface IBackConfig {
	authMethods?: IBackConfig.IAuthMethodsConfig;
	sessionCookie: {
		domain: string;
		maxAge: number;
	};
	host?: string;
	tokenSecret: string;

	mail: IBackConfig.IMailConfig;
	contactEmail: string;
	mailingList: IBackConfig.IMailingListConfig;
	common: ICommonConfig;
}
export namespace IBackConfig {
	export interface IAuthMethodsConfig {
		google?: IOAuthConfig.IGoogleOAuthConfig;
		github?: IOAuthConfig.IGithubOAuthConfig;
		emailPass?: IUserAuth.IEmailPassConfig;
	}

	export namespace IAuthMethodsConfig {
		export interface IGoogleOAuthConfig {
			appId: string;
			appSecret: string;
			redirectUrl: string;
		}

		export interface IGithubOAuthConfig {
			appId: string;
			appSecret: string;
			redirectUrl: string;
		}
	}

	export namespace IUserAuth {

		export interface IEmailPassConfig {
			emailField: string;
			passwordField: string;
		}
	}


	export interface IMailConfig {
		quoteRecipients: IMailConfig.IMailAddress[];
		smtpAuth: false | IMailConfig.IMailAccountConfig;
		mailBot: IMailConfig.IMailAddress;
	}
	export namespace IMailConfig {
		export interface IMailAccountConfig {
			host: string;
			port?: number;
			user: string;
			password: string;
		}

		export interface IMailAddress {
			name: string;
			email: string;
		}
	}

	export interface IMailingListConfig {
		apiKey: string;
		listId: number;
	}
}

export interface IFrontConfig {
	googleAnalyticsKey: string | false;
	common: ICommonConfig;
}
