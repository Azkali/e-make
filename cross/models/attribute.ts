import { IAttributeCategory } from './attributeCategory';
import { EFieldType, EntityUid } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";

export interface IAttribute{
	uid: string;
	name?: string;
	price: number;
	categoryId: EntityUid;
	category: IAttributeCategory
}
export const attribute: Raw.IAttributesDescription = {
	uid: {
		type: EFieldType.STRING,
		required: true,
	},
	name: EFieldType.STRING,
	price: {
		type: EFieldType.FLOAT,
		required: true
	},
	categoryId: {
		type: EFieldType.STRING,
		required: true,
	},
};
