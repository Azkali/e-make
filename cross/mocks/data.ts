import { IAttributeCategory } from '../models/attributeCategory';
import { IProduct } from '../models/product';
import { IAttribute } from '../models/attribute';

export const attributesCategories: IAttributeCategory[] = [
	{
		name: 'DAC type',
	},
	{
		name: 'Accessories',
	},
];

export const attributes: IAttribute[] = [
	{
		name: 'Allo BOSS 1.2',
		category: attributesCategories[0],
		categoryId: '',
		price: 15,
	},
	{
		name: 'IQ audio pro +',
		category: attributesCategories[0],
		categoryId: '',
		price: 78,
	},
	{
		name: 'RHA T20 EarBuds',
		category: attributesCategories[1],
		categoryId: '',
		price: 160,
	},
	
];

export const products: IProduct[] = [
	{
		name: 'Mango',
		images: ['https://via.placeholder.com/576x515.png?text=Mango'],
		customizableParts: [
			{
				name: 'Main DAC',
				factor: 1,
				category: attributesCategories[0],
				categoryId: '',
			},
			{
				name: '1st Accessory',
				factor: 1,
				category: attributesCategories[1],
				categoryId: '',
			},
		],
		basePrice: 20,
	},
	{
		name: 'Banana',
		images: ['https://via.placeholder.com/576x515.png?text=Banana'],
		basePrice: 10,
	},
	{
		name: 'ESPIO',
		images: ['https://via.placeholder.com/576x515.png?text=ESPIO'],
		customizableParts: [],
		basePrice: 15,
	},
]
