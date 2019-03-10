import { IAttribute } from '../models/attribute';
import { IAttributeCategory } from '../models/attributeCategory';
import { IProduct } from '../models/product';

export const attributesCategories: IAttributeCategory[] = [
	{
		uid: 'dac-type',
		name: 'DAC type',
	},
	{
		uid: 'accessories',
		name: 'Accessories',
	},
];

export const attributes: IAttribute[] = [
	{
		uid: 'allo-boss-1-2',
		name: 'Allo BOSS 1.2',
		category: attributesCategories[0],
		categoryId: '',
		price: 15,
	},
	{
		uid: 'iq-audio-pro-+',
		name: 'IQ audio pro +',
		category: attributesCategories[0],
		categoryId: '',
		price: 78,
	},
	{
		uid: 'rha-t20-earbuds',
		name: 'RHA T20 EarBuds',
		category: attributesCategories[1],
		categoryId: '',
		price: 160,
	},

];

export const products: IProduct[] = [
	{
		uid: 'espio',
		name: 'ESPIO',
		images: ['https://via.placeholder.com/576x515.png?text=ESPIO'],
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
		uid: 'banana',
		name: 'Banana',
		images: ['https://via.placeholder.com/576x515.png?text=Banana'],
		basePrice: 10,
	},
]
