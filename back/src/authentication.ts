/// <reference path="./types/index.d.ts"/>

import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import express = require( 'express' );
import { User } from './models';
import { sign } from 'jsonwebtoken';

import { Entity } from '@diaspora/diaspora/dist/types';

import { assign } from 'lodash';
import { logger } from './logger';

import { backConfig } from '../cross/config/environments/loader';
import { IUser, EAuthorization } from '../cross/models';
import { makeAbsoluteUrl } from '../cross/config/utils';



passport.serializeUser( async ( user: Entity<IUser & {id: any}>, done: ( err: Error | null, user: any ) => void ) => {
	done( null, user.getProperties( 'main' ) );
} );

passport.deserializeUser( async ( user: IUser & {id: any}, done: ( err: Error | null, user: any ) => void ) => {
	done( null, await User.find( user.id ) );
} );

const oauthConfig = backConfig.oauth;

// Load configs
if ( oauthConfig.google ){
	passport.use( new GoogleStrategy(
		{
			clientID: oauthConfig.google.appId,
			clientSecret: oauthConfig.google.appSecret,
			callbackURL: makeAbsoluteUrl( backConfig.common.back ) + oauthConfig.google.redirectUrl,
		},
		async ( accessToken, refreshToken, profile, done ) => {
			console.log( {accessToken, refreshToken, profile} );
			const user = await User.find( { googleId: profile.id } );
			logger.info( 'Logging in user for Google ID: ' + profile.id );
			if ( user ){
				logger.silly( `Retrieved user ${user.getId( 'main' )} for Google ID ${profile.id}` );
				return done( undefined, user );
			} else {
				try{
					const createdUser = await User.insert( { googleId: profile.id, authorizations: EAuthorization.User } );
					if ( !createdUser ){
						throw new Error( 'Could not create a new user' );
					}
					logger.verbose( `Created new user ${createdUser.getId( 'main' )} for Google ID ${profile.id}` );
					return done( undefined, createdUser );
				} catch ( e ){
					logger.error( `An error occured when creating user for Google ID ${profile.id}: ${e.message}` );
					return done( e, undefined );
				}
			}
		}
	) );
}

const createToken = ( auth: any ) =>
	sign(
		{ id: auth.id },
		backConfig.tokenSecret,
		{ expiresIn: 60 * 120 }
	);

const generateToken = ( req: express.Request, res: express.Response, next: express.NextFunction ) => {
	req.token = createToken( req.auth );
	next();
};

const sendToken = ( req: express.Request, res: express.Response ) => {
	if ( !req.token ){
		const message = 'Missing token';
		logger.error( `An error occured when setting user session: ${message}` );
		throw new Error( message );
	}
	req.session = assign( req.session, {auth: req.auth, token: req.token} );
	res.setHeader( 'x-auth-token', req.token );
	res.redirect( `${makeAbsoluteUrl( backConfig.common.front )}/${backConfig.common.front.afterAuthRoute}` );
};

export const initializePassport = ( app: express.Express ) => {
	app.use( passport.initialize() );
	app.use( passport.session() );

	app.get(
		'/auth/status',
		( req, res ) => {
			logger.verbose( 'Retrieving the authentication status' );
			if ( req.session && req.session.token ){
				logger.debug( `User with IP ${req.ip} is authenticated with session id ${req.session.token}` ); // Is it RGPD compliant ?
				return res.status( 200 ).json( {token: req.session.token} );
			} else {
				logger.debug( `User with IP ${req.ip} is NOT authenticated` ); // Is it RGPD compliant ?
				return res.status( 401 ).send( 'Unauthenticated' );
			}
		}
	);
	
	// GET /auth/google
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Google authentication will involve
	//   redirecting the user to google.com.  After authorization, Google
	//   will redirect the user back to this application at /auth/google/callback
	app.get(
		`${backConfig.common.back.auth.baseAuthRoute}/google`,
		passport.authenticate( 'google', { scope: [
			'email',
			'profile',
		] } )
	);
	
	if ( oauthConfig.google ){
		// GET /auth/google/callback
		//   Use passport.authenticate() as route middleware to authenticate the
		//   request.  If authentication fails, the user will be redirected back to the
		//   login page.  Otherwise, the primary route function function will be called,
		//   which, in this example, will redirect the user to the home page.
		app.get(
			oauthConfig.google.redirectUrl,
			passport.authenticate( 'google', { failureRedirect: '/login' } ),
			( req, res, next ) => {
				if ( !req.user ) {
					return res.sendStatus( 401 );
				}

				// prepare token for API
				req.auth = {
					id: req.user.getId( 'main' ),
				};
			
				next();
			},
			generateToken,
			sendToken
		);
	}
};
