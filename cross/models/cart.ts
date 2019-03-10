import { EFieldType, EntityUid } from '@diaspora/diaspora';
import { Raw } from '@diaspora/diaspora/dist/types/types/modelDescription';
import { ICartItem } from './cartItem';

export interface ITempCart {
	totalSum: number;
	totalCount: number;
	items?: ICartItem[];
}
export interface ICart extends ITempCart {
	userId?: EntityUid;
	user?: {};
	itemIds: EntityUid[];
}
export const cart: Raw.IAttributesDescription = {
	userId: EFieldType.STRING,
	totalSum: {
		type: EFieldType.FLOAT,
		required: true,
	},
	itemIds: {
		type: EFieldType.ARRAY,
		of: {
			type: EFieldType.STRING,
			required: true,
		},
		required: true,
	},
};
