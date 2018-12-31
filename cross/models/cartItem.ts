import { EntityUid, EFieldType } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";
import { IAttribute } from "./attribute";
import { IProduct } from "./product";

export interface ICartItem{
	unitPrice: number;
	count: number;
	item: {
		attributeUid: string
		attribute?: IAttribute
	} | {
		productUid: string,
		product: IProduct,
		attributesUids: _.Dictionary<string>;
		attributes?: _.Dictionary<IAttribute>;
	}
}

export const cartItem: Raw.IAttributesDescription = {
	unitPrice: {
		type: EFieldType.FLOAT,
		required: true
	},
	count: {
		type: EFieldType.INTEGER,
		required: true
	},
	item: {
		type: EFieldType.OBJECT,
		attributes: [
			{
				attributeUid: {
					type: EFieldType.STRING,
					required: true,
				}
			},
			{
				productUid: {
					type: EFieldType.STRING,
					required: true,
				},
				attributesUids: {
					type: EFieldType.OBJECT,
					required: true,
				}
			}
		] as any, // TODO fix object OR declaration
		required: true
	}
};
