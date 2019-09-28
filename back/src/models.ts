
import { ObjectId } from 'bson';
import { Buffer } from 'buffer';
import mongoose from 'mongoose';

import { backConfig } from '../../cross/config/environments/loader';
import { EAuthorization, IUser, IAddress, IQuote } from '../cross/models';
import { ECountryCode } from '../cross/models/countryCodes';

mongoose.connect( backConfig.databaseConnectionString, { useNewUrlParser: true, useUnifiedTopology: true } );

const slug = { type: String, required: true, lowercase: true };
export const Product = mongoose.model( 'Product', new mongoose.Schema( {
	slug,
	name: { type: String, required: true },
	customizableParts: [new mongoose.Schema( {
		factor: { type: Number, required: true },
		name: { type: String, required: true },
		categoryId: { type: ObjectId, required: true },
	} )],
	images: [{ type: String, required: true }],
	basePrice: { type: Number, required: true },
} ) );
export const User = mongoose.model<IUser & mongoose.Document>( 'User', new mongoose.Schema( {
	authorizations: { type: Number, required: true, default: EAuthorization.User },
	email: { type: String, required: true },
	password: { type: Buffer },

	facebookId: String,
	facebookToken: String,

	googleId: String,
	googleToken: String,

	githubId: String,
	githubToken: String,
} ) );
export const AttributeCategory = mongoose.model( 'AttributeCategory', new mongoose.Schema( {
	slug,
	name: { type: String, required: true },
} ) );
export const Attribute = mongoose.model( 'Attribute', new mongoose.Schema( {
	slug,
	name: { type: String, required: true },
	price: { type: Number, required: true },
	categoryId: { type: ObjectId, required: true },
} ) );
export const Address = mongoose.model<IAddress & mongoose.Document>( 'Address', new mongoose.Schema( {
	userId: { type: ObjectId, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: false },
	addr1: { type: String, required: true },
	addr2: { type: String, required: false },
	city: { type: String, required: true },
	postalCode: { type: String, required: true },
	country: { type: String, required: true, enum: Object.values( ECountryCode ) },
} ) );
export const Cart = mongoose.model( 'Cart', new mongoose.Schema( {
	userId: { type: ObjectId, required: true },
	totalSum: { type: Number, required: true },
	itemIds: [{ type: ObjectId, required: true }],
} ) );
export const CartItem = mongoose.model( 'CartItem', new mongoose.Schema( {
	unitPrice: { type: Number, required: true },
	count: { type: Number, required: true },
	item: {
		attributeUid: { type: ObjectId },
		productUid: { type: ObjectId },
		attributesUids: [{ type: ObjectId }],
	},
} ) );
export const Quote = mongoose.model<IQuote & mongoose.Document>( 'Quote', new mongoose.Schema( {
	userId: { type: ObjectId, required: true },
	billingAddressId: { type: ObjectId, required: true },
	shippingAddressId: { type: ObjectId, required: true },
	cartId: { type: ObjectId, required: true },
	message: { type: String },
} ) );
