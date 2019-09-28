import { IAttribute } from './attribute';

export interface IAttributeCategory {
	slug: string;
	name: string;
	attributes?: IAttribute[];
}
