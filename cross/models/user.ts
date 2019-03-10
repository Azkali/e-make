import { EFieldType } from '@diaspora/diaspora';
import { Raw } from '@diaspora/diaspora/dist/types/types/modelDescription';

export enum EAuthorization {
	User = 0b0,
	Admin = 0b11111,
}
export interface IUser {
	email?: string;
	password?: string;
	authorizations: EAuthorization;

	facebookId?: string;
	facebookToken?: string;

	googleId?: string;
	googleToken?: string;
}
export const user: Raw.IAttributesDescription = {
	email: EFieldType.STRING,
	password: EFieldType.STRING,
	authorizations: {
		type: EFieldType.INTEGER,
		required: true,
		default: EAuthorization.User,
	},

	facebookId: EFieldType.STRING,
	facebookToken: EFieldType.STRING,

	googleId: EFieldType.STRING,
	googleToken: EFieldType.STRING,
};
