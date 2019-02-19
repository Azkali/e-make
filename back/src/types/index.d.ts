import { Entity, EntityUid } from '@diaspora/diaspora';
import { IUser } from '../../../cross/models';
// import { IUser } from 'cross/models';

declare global {
	namespace Express {
		export interface Request {
			user?: Entity<IUser> | any;
			auth?: {
				id: EntityUid;
			};
			token?: string;
			//user?: Entity<IUser>;
			session?: Session;
		}
	}
}
