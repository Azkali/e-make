import { IAttribute } from './attribute';
import { EFieldType } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";

export interface IAttributeCategory{
    name?: string;
    attributes?: IAttribute[];
}
export const attributeCategory: Raw.IAttributesDescription = {
	name: EFieldType.STRING,
};
