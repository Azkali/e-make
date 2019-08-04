import express from 'express';
import { assign, compact, keys, mapValues, omit, omitBy, pick, values, zipObject } from 'lodash';
import { inspect } from 'util';

import { Entity } from '@diaspora/diaspora/dist/types';

import { sendQuoteMails } from './services/mailer';
import { subscribeUserToNewsletter } from './services/mailing-list';
import { Address, Cart, CartItem, Quote } from './models';
import { getUserId, isAuthenticated } from './security';

import { IAddress, IQuote, IUser } from '../cross/models';
import { ICart } from '../cross/models/cart';
import { logger } from './logger';

interface IAddressHash {
	billingAddress: Entity<IAddress>;
	shippingAddress: Entity<IAddress>;
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
	const insertedAddressesObject = zipObject( keys( addresses ), insertedAddresses.entities );
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
	const itemIds = ( await CartItem.insertMany( body.cart.items ) )
		.toChainable()
		.map( entity => entity.getId( 'main' ) )
		.value();
	const cart = assign( {}, omit( body.cart, 'items' ), { userId, itemIds } );
	const cartInserted = await Cart.insert( cart );
	return cartInserted;
};
const insertAddressesAndCart = async ( body: any, userId: any ) => {
	const promisesResolutions = await Promise.all( [
		insertAddresses( body, userId ),
		insertCart( body, userId ),
	] );
	return zipObject( ['addresses', 'cart'], promisesResolutions ) as {addresses: IAddressHash; cart: Entity<ICart>};
};

const saveAndSaveQuote = async ( req: express.Request ) => {
	const userId = getUserId( req );
	const body = req.body;

	const { addresses, cart } = await insertAddressesAndCart( body, userId );
	const quote = {
		billingAddressId: addresses.billingAddress.getId( 'main' ) as any,
		shippingAddressId: addresses.shippingAddress.getId( 'main' ) as any,

		cartId: cart.getId( 'main' ) as any,
		userId,
	};
	const insertedQuote = await Quote.insert( quote ) as Entity<IQuote>;

	// TODO: Deep populate
	const cartNoId = omitBy( cart.getAttributes( 'main' ), ( val, key ) => key.endsWith( 'Id' ) );
	const fullQuote = {
		id: insertedQuote.getId( 'main' ),

		billingAddress: addresses.billingAddress.getAttributes( 'main' ),
		shippingAddress: addresses.shippingAddress.getAttributes( 'main' ),

		cart: assign( cartNoId, { items: body.cart.items } ),
		message: body.message,
		user: ( req.user as Entity<IUser> ).getAttributes( 'main' ),
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
		return res.status( 201 ).send( { quoteId: insertedQuote.getId( 'main' ) } );
	} catch ( e ) {
		logger.error( `An error occured while saving the quote & sending mails: ${e.message}` );
	}
};
