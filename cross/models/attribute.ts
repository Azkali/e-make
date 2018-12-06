import { EFieldType } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";

export interface IAttribute{
    name?: string;
    price?: number;
}
export const attribute: Raw.IAttributesDescription = {
    name: EFieldType.STRING,
    price: EFieldType.FLOAT,
};
