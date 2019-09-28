import express from 'express';
import { assign, compact, keys, mapValues, omit, omitBy, pick, values, zipObject } from 'lodash';
import mongoose from 'mongoose';

import { Address, Cart, CartItem, Quote } from './models';
import { getUserId, isAuthenticated } from './security';
import { sendQuoteMails } from './services/mailer';
import { subscribeUserToNewsletter } from './services/mailing-list';

import { IAddress, IQuote, IUser } from '../cross/models';
import { ICart } from '../cross/models/cart';
import { ICartItem } from '../cross/models/cartItem';
import { logger } from './logger';

interface IAddressHash {
	billingAddress: IAddress & mongoose.Document;
	shippingAddress: IAddress & mongoose.Document;
}

const insertAddresses = async ( body: any, userId: any ) => {
	const pickedAddresses = pick<IAddress, any>( body, ['address', 'billingAddress', 'shippingAddress'] );
	const addresses = mapValues<any, IAddress>( pickedAddresses, ( address: IAddress ) => {
		address.userId = userId;
		return address;
	} );

	const insertedAddresses = await Address.insertMany( compact( [
		addresses.address,
		addresses.billingAddress,
		addresses.shippingAddress,
	] ) );
	const insertedAddressesObject = zipObject( keys( addresses ), insertedAddresses );
	if ( keys( insertedAddressesObject ).length === 1 ) {
		return {
			billingAddress: insertedAddressesObject.address,
			shippingAddress: insertedAddressesObject.address,
		} as IAddressHash;
	} else {
		return insertedAddressesObject as any as IAddressHash;
	}
};
const insertCart = async ( body: any, userId: any ) => {
	const itemIds = ( await CartItem.insertMany( body.cart.items as ICartItem[] ) )
		.map( entity => entity._id );
	const cart = assign( {}, omit( body.cart, 'items' ), { userId, itemIds } );
	const cartInserted = await Cart.create( cart );
	return cartInserted;
};
const insertAddressesAndCart = async ( body: any, userId: any ) => {
	const promisesResolutions = await Promise.all( [
		insertAddresses( body, userId ),
		insertCart( body, userId ),
	] );
	return zipObject( ['addresses', 'cart'], promisesResolutions ) as {addresses: IAddressHash; cart: ICart & mongoose.Document};
};

const saveAndSaveQuote = async ( req: express.Request ) => {
	const userId = getUserId( req );
	const body = req.body;

	const { addresses, cart } = await insertAddressesAndCart( body, userId );
	const quote = {
		billingAddressId: addresses.billingAddress._id,
		shippingAddressId: addresses.shippingAddress._id,

		cartId: cart._id,
		userId,
	};
	const insertedQuote = await Quote.create( quote );

	// TODO: Deep populate
	const cartNoId = omitBy( cart, ( val, key ) => key.endsWith( 'Id' ) );
	const fullQuote = {
		id: insertedQuote._id,

		billingAddress: addresses.billingAddress._id,
		shippingAddress: addresses.shippingAddress._id,

		cart: assign( cartNoId, { items: body.cart.items } ),
		message: body.message,
		user: ( req.user as IUser & mongoose.Document ),
	} as any as IQuote;
	await sendQuoteMails( fullQuote, body.copyToUser );

	return insertedQuote;
};

export const quoteAction: express.RequestHandler = async ( req, res, next ) => {
	if ( !isAuthenticated( req ) ) {
		return res.status( 401 ).send( 'You need to log in.' );
	}

	try {
		const [insertedQuote] = await ( req.body.subscribeNews ?
			Promise.all( [ saveAndSaveQuote( req ), subscribeUserToNewsletter( req ) ] ) :
			Promise.all( [ saveAndSaveQuote( req ) ] ) );
		if ( !insertedQuote ) {
			return res.status( 500 ).send( 'WTF ?' );
		}
		return res.status( 201 ).send( { quoteId: insertedQuote._id } );
	} catch ( e ) {
		logger.error( `An error occured while saving the quote & sending mails: ${e.message}` );
	}
};
