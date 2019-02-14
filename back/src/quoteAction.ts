import express from 'express';
import { pick, values, assign, mapValues, compact, zipObject, keys, omit, omitBy } from 'lodash';

import { isAuthenticated, getUserId } from './security';
import { IAddress, IQuote, IUser } from '../../cross/models';
import { Address, Quote, Cart, CartItem } from './models';
import { Entity } from '@diaspora/diaspora/dist/types';
import { ICart } from '../../cross/models/cart';
import { inspect } from 'util';
import { sendQuoteMails } from './mailer';

interface IAddressHash{
	billingAddress: Entity<IAddress>;
	shippingAddress: Entity<IAddress>;
}

const insertAddresses = async ( body: any, userId: any ) => {
	const addresses = mapValues<any, IAddress>(
		pick<IAddress, any>( body, ['address', 'billingAddress', 'shippingAddress'] ),
		( address: IAddress ) => {
			address.userId = userId;
			return address;
		} );
	const addressesInserted = zipObject(
		keys( addresses ),
		( await Address.insertMany(
			compact( [addresses.address, addresses.billingAddress, addresses.shippingAddress] ) ) ).entities );
	if ( keys( addressesInserted ).length === 1 ){
		return {
			billingAddress: addressesInserted.address,
			shippingAddress: addressesInserted.address,
		} as IAddressHash;
	} else {
		return addressesInserted as any as IAddressHash;
	}
};
const insertCart = async ( body: any, userId: any ) => {
	const itemIds = ( await CartItem.insertMany( body.cart.items ) )
		.toChainable()
		.map( entity => entity.getId( 'main' ) )
		.value();
	const cart = assign(
		{},
		omit( body.cart, 'items' ),
		{userId, itemIds} );
	const cartInserted = await Cart.insert( cart );
	return cartInserted;
};
const insertAddressesAndCart = async ( body: any, userId: any ) =>
	zipObject(
		['addresses', 'cart'],
		await Promise.all( [
			insertAddresses( body, userId ),
			insertCart( body, userId ),
		] ) ) as {addresses: IAddressHash; cart: Entity<ICart>};

export const quoteAction: express.RequestHandler = async ( req, res, next ) => {
	if ( !isAuthenticated( req ) ){
		return res.status( 401 ).send( 'You need to log in.' );
	}
	const userId = getUserId( req );
	const body = req.body;

	const {addresses, cart} = await insertAddressesAndCart( body, userId );
	const quote = {
		billingAddressId: addresses.billingAddress.getId( 'main' ) as any,
		shippingAddressId: addresses.shippingAddress.getId( 'main' ) as any,
		cartId: cart.getId( 'main' ) as any,
		userId,
	};
	const insertedQuote = await Quote.insert( quote ) as Entity<IQuote>;

	// TODO: Deep populate
	const fullQuote = {
		billingAddress: addresses.billingAddress.getAttributes( 'main' ),
		shippingAddress: addresses.shippingAddress.getAttributes( 'main' ),
		cart: assign(
			omitBy( cart.getAttributes( 'main' ), ( val, key ) => key.endsWith( 'Id' ) ),
			{ items: body.cart.items }
		),
		user: ( req.user as Entity<IUser> ).getAttributes( 'main' ),
	};
	console.log( inspect( fullQuote, {colors: true, depth: 10} ) );
	await sendQuoteMails( fullQuote as any );
	return res.status( 501 ).send( 'Not implemented ' + insertedQuote.getId( 'main' ) );
};
