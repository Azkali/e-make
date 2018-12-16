import { EntityUid, EFieldType } from "@diaspora/diaspora";
import { Raw } from "@diaspora/diaspora/dist/types/types/modelDescription";
import { IAttribute } from "./attribute";
import { IProduct } from "./product";

export interface ICartItem{
	unitPrice: number;
	count: number;
	item: {
		attributeId: EntityUid
		attribute?: IAttribute
	} | {
		productId: EntityUid,
		product: IProduct,
		attributesIds: _.Dictionary<EntityUid>;
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
				attributeId: {
					type: EFieldType.STRING,
					required: true,
				}
			},
			{
				productId: {
					type: EFieldType.STRING,
					required: true,
				},
				attributesIds: {
					type: EFieldType.OBJECT,
					required: true,
				}
			}
		] as any, // TODO fix object OR declaration
		required: true
	}
};
