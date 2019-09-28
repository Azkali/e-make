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
	itemIds: EntityUid[];
}
