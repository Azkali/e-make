import { EntityUid } from '@diaspora/diaspora';

import { IAttributeCategory } from './attributeCategory';
import { IProduct } from './product';

export interface IProduct {
	slug: string;
	name?: string;
	customizableParts?: IProduct.IPart[];
	images?: string[];
	basePrice: number;
}
export namespace IProduct {
	export interface IPart {
		factor: number;
		name: string;
		categoryId: EntityUid;
		category?: IAttributeCategory;
	}
}
