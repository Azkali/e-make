import { EScheme } from "../utils";

export const config = {
	back: {
		scheme: EScheme.Http,
		fqdn: "api.e-make.io",
		port: 8765,
		auth:{
			baseAuthRoute: '/auth',
			availableMethods: ['google'],
		}
	},
	front: {
		scheme: EScheme.Http,
		fqdn: "www.e-make.io",
		port: 4200,
		afterAuthRoute: 'auth-ok',
	},
	production: false,
}
