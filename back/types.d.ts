import { Entity, EntityUid } from '@diaspora/diaspora';
import { IUser } from '../cross/models';

declare global {
	namespace Express {
		export interface Request {
			auth?: {
				id: EntityUid;
			};
			token?: string;
			//user?: Entity<IUser>;
		}
	}
}
