import { EFieldType, EntityUid } from '@diaspora/diaspora';
import { Raw } from '@diaspora/diaspora/dist/types/types/modelDescription';

import { IUser } from './user';
import { ICart } from './cart';
import { IAddress } from './address';

export interface IQuote {
	userId: EntityUid;
	user?: IUser
	billingAddressId: EntityUid;
	billing?: IAddress,
	shippingAddressId: EntityUid;
	shipping?: IAddress,
	cartId: EntityUid;
	cart?: ICart;
	message?: string;
}
export const quote: Raw.IAttributesDescription = {
	userId: {
		type: EFieldType.STRING,
		required: true,
	},
	billingAddressId: {
		type: EFieldType.STRING,
		required: true,
	},
	shippingAddressId: {
		type: EFieldType.STRING,
		required: true,
	},
	cartId: {
		type: EFieldType.STRING,
		required: true,
	},
	message: {
		type: EFieldType.STRING,
	},
}
