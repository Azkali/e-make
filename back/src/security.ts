import express = require( 'express' );
import { IDiasporaApiRequest, IDiasporaApiRequestDescriptor } from '@diaspora/plugin-server';
import { Entity } from '@diaspora/diaspora/dist/types';
import { isNil, assign } from 'lodash';

import { IEntityProperties } from '@diaspora/diaspora/dist/types/types/entity';
import { EQueryAction } from '@diaspora/plugin-server/lib/utils';

import { logger } from './logger';

import { IUser, EAuthorization } from '../cross/models';


export const getUserId = ( req: express.Request ) => ( ( req.user as Entity<IUser> ).getProperties( 'main' ) as ( IUser & IEntityProperties ) ).id;

export const isAuthenticated = ( req: express.Request ) => req.isAuthenticated() && req.user && ( req.user as Entity<IUser> ).getProperties( 'main' );
const isAdmin = ( req: express.Request ) =>
	( ( ( req.user as Entity<IUser> ).attributes as IUser ).authorizations & EAuthorization.Admin ) === EAuthorization.Admin;
const onlyAsUser = ( req: express.Request, queryObject: any ) =>
	isNil( queryObject.userId ) ||
	queryObject.userId === getUserId( req.user );


const isAuthenticatedMiddleware = ( req: express.Request, res: express.Response, next: () => void ) => {
	console.log( 'Checking authenticated' );
	if ( !isAuthenticated( req ) ){
		return res.sendStatus( 403 );
	}
	return next();
};
const isAdminMiddleware = ( req: express.Request, res: express.Response, next: () => void ) => {
	if ( !isAuthenticated( req ) ){
		return res.status( 401 ).send( 'Please log in to access this route' );
	}
	if ( !isAdmin( req ) ){
		return res.status( 403 ).send( 'You don\'t have the permissions to access this route.' );
	}
	return next();
};
export const onlyAsAuthorOrAdminMiddleware = ( req: IDiasporaApiRequest<any, IDiasporaApiRequestDescriptor<any>>, res: express.Response, next: express.NextFunction ) => {
	if ( !isAuthenticated( req ) ){
		logger.warn( 'Logged out user tried to post user data.' );
		return res.status( 401 ).send( 'Please log in to post this user data' );
	}
	const userId = getUserId( req );

	// Filter on no body
	if ( isAdmin( req ) ){
		logger.info( `Admin request on user data model "${req.diasporaApi.model.name}":`, req.diasporaApi );
		return next();
	}
	if ( [EQueryAction.INSERT, EQueryAction.REPLACE, EQueryAction.UPDATE].indexOf( req.diasporaApi.action ) !== -1 ){
		if ( !onlyAsUser( req, req.diasporaApi.body ) || !onlyAsUser( req, req.diasporaApi.where ) ){
			logger.warn( `User "${userId}" tried to ${req.diasporaApi.action} ${req.diasporaApi.model.name} as a different user.`, req.diasporaApi );
			return res.status( 403 ).send( 'You can\'t post data as another user.' );
		}
		req.diasporaApi.body = assign( req.diasporaApi.body, {userId} );
	}
	if ( !onlyAsUser( req, req.diasporaApi.where ) ){
		logger.warn( `User tried to post user data as a different user: data user id "${( req.diasporaApi.where as any ).userId}"; actual user id: "${userId}"` );
		return res.status( 403 ).send( 'You can\'t post data as another user.' );
	}
	req.diasporaApi.where = assign( req.diasporaApi.where, {userId} );
	logger.info( `${req.diasporaApi.action} request OK for model "${req.diasporaApi.model.name}" by user "${userId}".`, req.diasporaApi );
	return next();
};

export const writeOnlyForAdmin = {
	insert: isAdminMiddleware,
	update: isAdminMiddleware,
	delete: isAdminMiddleware,
};

export const allOnlyAsAuthorOrAdminMiddleware = {
	find: onlyAsAuthorOrAdminMiddleware,
	insert: onlyAsAuthorOrAdminMiddleware,
	update: onlyAsAuthorOrAdminMiddleware,
	delete: onlyAsAuthorOrAdminMiddleware,
	replace: onlyAsAuthorOrAdminMiddleware,
};
