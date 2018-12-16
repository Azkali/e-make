import { EFieldType, EntityUid } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";
import { ICartItem } from './cartItem';

export interface ICart{
	userId?: EntityUid;
	user?: {};
	totalSum: number;
	totalCount: number;
	itemIds: EntityUid[];
	items?: ICartItem[];
}
export const cart: Raw.IAttributesDescription = {
	userId: EFieldType.STRING,
	totalSum: {
		type: EFieldType.FLOAT,
		required: true
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
