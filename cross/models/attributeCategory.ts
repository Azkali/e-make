import { EFieldType } from '@diaspora/diaspora';
import { Raw } from '@diaspora/diaspora/dist/types/types/modelDescription';
import { IAttribute } from './attribute';

export interface IAttributeCategory {
	uid: string;
	name?: string;
	attributes?: IAttribute[];
}
export const attributeCategory: Raw.IAttributesDescription = {
	uid: {
		type: EFieldType.STRING,
		required: true,
	},
	name: EFieldType.STRING,
};
