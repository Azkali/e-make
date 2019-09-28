import { Dictionary } from 'lodash';

import { IAttribute } from './attribute';
import { IProduct } from './product';

export interface ICartItem {
	unitPrice: number;
	count: number;
	item: {
		attributeUid: string;
		attribute?: IAttribute;
	} | {
		productUid: string;
		product?: IProduct;
		attributesUids: Dictionary<string>;
		attributes?: Dictionary<IAttribute>;
	};
}
