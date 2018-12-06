import { EFieldType } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";

export interface IAttributeCategory{
    name?: string;
}
export const attributeCategory: Raw.IAttributesDescription = {
	name: EFieldType.STRING,
};
