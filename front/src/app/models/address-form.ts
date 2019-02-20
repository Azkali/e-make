import { ECountryCode } from '~cross/models/countryCodes';
import { toPairs, map } from 'lodash';

export const addressFormExtra = {
	firstname: {
		label: 'First name',
		controlType: 'text',
		validation: {
			minLength: 2,
		},
	},
	lastname: {
		label: 'Last name',
		controlType: 'text',
		validation: {
			minLength: 2,
		},
	},
	email: {
		label: 'Email',
		controlType: 'email',
		validation: {
			minLength: 5,
		},
	},
	phone: {
		label: 'Phone',
		controlType: 'text',
		validation: {
			minLength: 8,
		},
	},
	addr1: {
		label: 'Address (line 1)',
		controlType: 'text',
		validation: {
			minLength: 10,
		},
	},
	addr2: {
		label: 'Address (line 2)',
		controlType: 'text',
		validation: {},
	},
	city: {
		label: 'City',
		controlType: 'text',
		validation: {
			minLength: 2,
		},
	},
	postalCode: {
		label: 'Postal code',
		controlType: 'text',
		validation: {
			minLength: 3,
		},
	},
	country: {
		label: 'Country',
		options: map( toPairs( ECountryCode ), ( [countryName, countryCode] ) => ( {
			value: countryCode,
			label: countryName.toLowerCase().replace( /(_|^)(\w)?/g, ( wholematch: string, space: string, letter: string ) =>
				( space ? ' ' : '' ) + ( letter ? letter.toUpperCase() : '' ) ),
		} ) ),
	},
};
