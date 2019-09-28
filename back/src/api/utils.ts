import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { compact } from 'lodash';
import mongoose from 'mongoose';
import { ICrudSecurity } from '../security';

export const trowingMiddleware = <T>( handler: ( req: Request, res: Response, next: NextFunction ) => Promise<T> ): RequestHandler =>
	async ( req, res, next ) => {
		let hasNext = false;
		try {
			const ret = await handler( req, res, () => {
				hasNext = true;
			} );
			if ( hasNext ) {
				return next();
			}
			if ( !res.headersSent ) {
				return ret;
			}
		} catch ( e ) {
			return res.status( 500 ).json( e );
		}
	};

export const buildMiddlewares = ( model: mongoose.Model<any, any>, crudSecurityPolicy: ICrudSecurity = {} ) => {
	// Single
	const single = Router();

	single.get( '/:id', compact( [
		crudSecurityPolicy.find,
		trowingMiddleware( async ( req, res ) => res.json( await model.findById( req.params.id ).exec() ) ),
	] ) );
	single.get( '/', compact( [
		crudSecurityPolicy.find,
		trowingMiddleware( async ( req, res ) => res.json( await model.findOne( req.query ).exec() ) ),
	] ) );

	single.put( '/', compact( [
		crudSecurityPolicy.insert,
		trowingMiddleware( async ( req, res ) => {
			const created = await model.create( req.body );
			res.setHeader( 'link', created._id );
			res.json( created );
		} ),
	] ) );

	// Batch
	const batch = Router();

	batch.get( '/', compact( [
		crudSecurityPolicy.find,
		trowingMiddleware( async ( req, res ) => res.json( await model.find( req.query ).exec() ) ),
	] ) );
	return { single, batch };
};
