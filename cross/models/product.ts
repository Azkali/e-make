import { IProduct } from './product';
import { IAttributeCategory } from './attributeCategory';
import { EFieldType, EntityUid } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";

export interface IProduct{
	uid: string;
	name?: string;
	customizableParts?: IProduct.IPart[];
	images?: string[];
	basePrice: number;
}
export namespace IProduct{
	export interface IPart{
		factor: number;
		name: string;
		categoryId: EntityUid;
		category?: IAttributeCategory;
	}
}
export const product: Raw.IAttributesDescription = {
	uid: {
		type: EFieldType.STRING,
		required: true,
	},
	name: EFieldType.STRING,
	customizableParts: {
		type: EFieldType.ARRAY,
		of: {
			type: EFieldType.OBJECT,
			attributes: {
				factor: {
					type: EFieldType.INTEGER,
					required: true,
					default: 1,
				},
				name: {
					type: EFieldType.STRING,
					required: true,
				},
				categoryId: {
					type: EFieldType.STRING,
					required: true,
				}
			}
		},
	},
	images: {
		type: EFieldType.ARRAY,
		of: EFieldType.STRING,
	},
	basePrice: {
		type: EFieldType.FLOAT,
		required: true,
	}
};
