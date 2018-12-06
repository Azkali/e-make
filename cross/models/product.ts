import { attributeCategory } from './attributeCategory';
import { EFieldType } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";

export interface IProduct{
    name?: string;
    attributeCategory?: number[];
    images?: string[];
}
export const product: Raw.IAttributesDescription = {
	name: EFieldType.STRING,
	attributeCategories: {
		type: EFieldType.ARRAY,
		of: EFieldType.INTEGER,
	},
	images: {
		type: EFieldType.ARRAY,
		of: EFieldType.STRING,
	},
};
