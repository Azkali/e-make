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

	githubId?: string;
	gihtubToken?: string;
}
