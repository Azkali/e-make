import { EFieldType, EntityUid } from '@diaspora/diaspora';
import { Raw } from '@diaspora/diaspora/dist/types/types/modelDescription';

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
export const address: Raw.IAttributesDescription = {
	userId: {
		type: EFieldType.STRING,
		required: true,
	},
	firstname: {
		type: EFieldType.STRING,
		required: true,
	},
	lastname: {
		type: EFieldType.STRING,
		required: true,
	},
	email: {
		type: EFieldType.STRING,
		required: true,
	},
	phone: {
		type: EFieldType.STRING,
		required: false,
	},
	addr1: {
		type: EFieldType.STRING,
		required: true,
	},
	addr2: {
		type: EFieldType.STRING,
		required: false,
	},
	city: {
		type: EFieldType.STRING,
		required: true,
	},
	postalCode: {
		type: EFieldType.STRING,
		required: true,
	},
	country: {
		type: EFieldType.STRING,
		required: true,
		enum: Object.keys( ECountryCode ).map( k => ECountryCode[k as any] ),
	},
};
