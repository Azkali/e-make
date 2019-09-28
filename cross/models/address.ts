import { EntityUid } from '@diaspora/diaspora';

import { ECountryCode } from './countryCodes';
import { IUser } from './user';

export interface IAddress {
	userId: EntityUid;
	user?: IUser;
	firstname: string;
	lastname: string;
	email: string;
	// see https://www.npmjs.com/package/google-libphonenumber for validation
	phone: string;

	addr1: string;
	addr2: string;
	city: string;
	// see https://stackoverflow.com/a/7185241 Validation infos
	postalCode: string;
	country: ECountryCode;
}
