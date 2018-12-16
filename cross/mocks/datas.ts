import { IAttributeCategory } from '../models/attributeCategory';
import { IProduct } from '../models/product';
import { IAttribute } from '../models/attribute';

export const attributesCategories: IAttributeCategory[] = [
	{
		name: 'DAC type',
	}
]

export const attributes: IAttribute[] = [
	{
		name: 'Allo BOSS 1.2',
		category: attributesCategories[0],
		categoryId: '',
		price: 15
	},
	{
		name: 'IQ audio pro +',
		category: attributesCategories[0],
		categoryId: '',
		price: 78
	}
]

export const products: IProduct[] = [
	{
		name: "Mango",
		images: ["https://via.placeholder.com/576x515.png?text=Mango"],
		customizableParts: [
			{
				name: 'Main DAC',
				factor: 1,
				category: attributesCategories[0],
				categoryId: '',
			}
		],
		basePrice: 20,
	},
	{
		name: "Banana",
		images: ["https://via.placeholder.com/576x515.png?text=Banana"],
		basePrice: 10,
	},
	{
		name: "ESPIO",
		images: ["https://via.placeholder.com/576x515.png?text=ESPIO"],
		customizableParts: [],
		basePrice: 15,
	},
]
