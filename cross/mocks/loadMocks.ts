import { Model, Set } from '@diaspora/diaspora';
import { IEntityProperties } from '@diaspora/diaspora/dist/types/types/entity';

import { IAttribute } from '../models/attribute';
import { IAttributeCategory } from '../models/attributeCategory';
import { IProduct } from '../models/product';
import { attributes, attributesCategories, products } from './data';

export const loadMocks = async (
	dataSourceName: string,
	AttributeCategory: Model<IAttributeCategory>,
	Attribute: Model<IAttribute>,
	Product: Model<IProduct>,
) => {
	const insertedAttributeCategories = await AttributeCategory.insertMany( attributesCategories );
	const [insertedAttributes, insertedProducts] = await Promise.all( [
		Attribute.insertMany( attributes.map( attr => {
			const attributeCategoryEntity = insertedAttributeCategories
				.toChainable( Set.ETransformationMode.PROPERTIES, dataSourceName )
				.find<Array<IAttributeCategory & IEntityProperties>>( { name: attr.category.name } )
				.value() as ( IAttributeCategory & IEntityProperties );
			attr.categoryId = attributeCategoryEntity.id;
			delete attr.category;
			return attr;
		} ) ),
		Product.insertMany( products.map( product => {
			if ( product.customizableParts ) {
				product.customizableParts = product.customizableParts.map( part => {
					const attributeCategoryEntity = insertedAttributeCategories
						.toChainable( Set.ETransformationMode.PROPERTIES, dataSourceName )
						.find<Array<IAttributeCategory & IEntityProperties>>( { name: ( part.category as IAttributeCategory ).name } )
						.value() as ( IAttributeCategory & IEntityProperties );
					part.categoryId = attributeCategoryEntity.id;
					delete part.category;
					return part;
				} );
			}
			return product;
		} ) ),
	] );
 console.info( 'Mock data inserted!' );
 };
