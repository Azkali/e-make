export enum EScheme{
	Http = 1,
	Https = 2,
}
export interface IUrlConfig{
	fqdn: string;
	scheme: EScheme;
	port?: number;
	baseurl?: string;
};


export interface ICommonConfig{
	back: IUrlConfig & {
		auth: ICommonConfig.IBackAuthPathConfig;
		apiBaseUrl: string;
	};
	front: IUrlConfig & {
		afterAuthRoute: string;
	};
	production: boolean;
}
export namespace ICommonConfig{
	export interface IBackAuthPathConfig{
		baseAuthRoute: string,
		availableMethods: (keyof IBackConfig.IOAuthConfig)[],
	}
}

export interface IBackConfig{
	oauth: IBackConfig.IOAuthConfig;
	host: string,
	tokenSecret: string,
	
	mail: IBackConfig.IMailConfig;
	contactEmail: string,
	mailingList: IBackConfig.IMailingListConfig;
	common: ICommonConfig;
}
export namespace IBackConfig{
	export interface IOAuthConfig{
		google?: IOAuthConfig.IGoogleOAuthConfig;
	}
	export namespace IOAuthConfig{
		export interface IGoogleOAuthConfig{
			appId: string;
			appSecret: string;
			redirectUrl: string;
		}
	}

	export interface IMailConfig{
		quoteRecipients: IMailConfig.IMailAddress[];
		smtpAuth: false | IMailConfig.IMailAccountConfig;
		mailBot: IMailConfig.IMailAddress;
	}
	export namespace IMailConfig{
		export interface IMailAccountConfig{
			host: string;
			port?: number;
			user: string;
			password: string;
		}
		
		export interface IMailAddress{
			name: string;
			email: string;
		}
	}

	export interface IMailingListConfig{
		apiKey: string;
		listId: number;
	}
}

export interface IFrontConfig{
	googleAnalyticsKey: string | false;
	common: ICommonConfig;
};
