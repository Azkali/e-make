import { EntityUid } from '@diaspora/diaspora';

import { IAttributeCategory } from './attributeCategory';

export interface IAttribute {
	slug: string;
	name?: string;
	price: number;
	categoryId: EntityUid;
	category: IAttributeCategory;
}
