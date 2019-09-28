import { EntityUid } from '@diaspora/diaspora';

import { IAddress } from './address';
import { ICart } from './cart';
import { IUser } from './user';

export interface IQuote {
	userId: EntityUid;
	user?: IUser;
	billingAddressId: EntityUid;
	billing?: IAddress;
	shippingAddressId: EntityUid;
	shipping?: IAddress;
	cartId: EntityUid;
	cart?: ICart;
	message?: string;
}
