/// <reference path="./types/index.d.ts"/>

import express = require( 'express' );
import { sign } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './models';

import { Entity } from '@diaspora/diaspora/dist/types';

import { assign } from 'lodash';
import { logger } from './logger';

import { backConfig } from '../cross/config/environments/loader';
import { makeAbsoluteUrl } from '../cross/config/utils';
import { EAuthorization, IUser } from '../cross/models';

passport.serializeUser( async ( user: Entity<IUser & { id: any }>, done: ( err: Error | null, user: any ) => void ) => {
	done( null, user.getProperties( 'main' ) );
} );

passport.deserializeUser( async ( user: IUser & { id: any }, done: ( err: Error | null, user: any ) => void ) => {
	done( null, await User.find( user.id ) );
} );

const authConfig = backConfig.authMethods;

// Load configs
if ( authConfig.google ) {
	passport.use( new GoogleStrategy(
		{
			clientID: authConfig.google.appId,
			clientSecret: authConfig.google.appSecret,
			callbackURL: makeAbsoluteUrl( backConfig.common.back ) + authConfig.google.redirectUrl,
		},
		async ( accessToken, refreshToken, profile, done ) => {
			console.log( { accessToken, refreshToken, profile } );
			const user = await User.find( { googleId: profile.id } );
			logger.info( 'Logging in user for Google ID: ' + profile.id );
			if ( user ) {
				logger.silly( `Retrieved user ${user.getId( 'main' )} for Google ID ${profile.id}` );
				return done( undefined, user );
			} else {
				try {
					const createdUser = await User.insert( { googleId: profile.id, authorizations: EAuthorization.User } );
					if ( !createdUser ) {
						throw new Error( 'Could not create a new user' );
					}
					logger.verbose( `Created new user ${createdUser.getId( 'main' )} for Google ID ${profile.id}` );
					return done( undefined, createdUser );
				} catch ( e ) {
					logger.error( `An error occured when creating user for Google ID ${profile.id}: ${e.message}` );
					return done( e, undefined );
				}
			}
		},
	) );
		}
if ( authConfig.github ) {
	passport.use( new GitHubStrategy(
		{
			clientID: authConfig.github.appId,
			clientSecret: authConfig.github.appSecret,
			callbackURL: makeAbsoluteUrl( backConfig.common.back ) + authConfig.github.redirectUrl,
		},
		async ( accessToken, refreshToken, profile, done ) => {
			console.log( { accessToken, refreshToken, profile } );
			const user = await User.find( { githubId: profile.id } );
			logger.info( 'Logging in user for Github ID: ' + profile.id );
			if ( user ) {
				logger.silly( `Retrieved user ${user.getId( 'main' )} for Github ID ${profile.id}` );
				return done( undefined, user );
			} else {
				try {
					const createdUser = await User.insert( { githubId: profile.id, authorizations: EAuthorization.User } );
					if ( !createdUser ) {
						throw new Error( 'Could not create a new user' );
					}
					logger.verbose( `Created new user ${createdUser.getId( 'main' )} for Github ID ${profile.id}` );
					return done( undefined, createdUser );
				} catch ( e ) {
					logger.error( `An error occured when creating user for Github ID ${profile.id}: ${e.message}` );
					return done( e, undefined );
			}
			}
		},
	) );
}
if ( authConfig.github ) {
	passport.use( new GitHubStrategy(
		{
			clientID: authConfig.github.appId,
			clientSecret: authConfig.github.appSecret,
			callbackURL: makeAbsoluteUrl( backConfig.common.back ) + authConfig.github.redirectUrl,
		},
// tslint:disable-next-line: align
		async ( accessToken, refreshToken, profile, done ) => {
			console.log( { accessToken, refreshToken, profile } );
			const user = await User.find( { githubId: profile.id } );
			logger.info( 'Logging in user for Github ID: ' + profile.id );
			if ( user ) {
				logger.silly( `Retrieved user ${user.getId( 'main' )} for Github ID ${profile.id}` );
				return done( undefined, user );
			} else {
				try {
					const createdUser = await User.insert( { githubId: profile.id, authorizations: EAuthorization.User } );
					if ( !createdUser ) {
						throw new Error( 'Could not create a new user' );
					}
					logger.verbose( `Created new user ${createdUser.getId( 'main' )} for Github ID ${profile.id}` );
					return done( undefined, createdUser );
				} catch ( e ) {
					logger.error( `An error occured when creating user for Github ID ${profile.id}: ${e.message}` );
					return done( e, undefined );
				}
			}
		},
	) );
}

if ( authConfig.emailPass ) {
	passport.use( new LocalStrategy(
		{
			usernameField: authConfig.emailPass.usernameField,
			passwordField: authConfig.emailPass.passwordField,
		},
		async ( username, password, done ) => {
			const user = await User.find( { username } );
			logger.info( 'Logging in user for Local Username ID: ' + username.id );
			if ( user ) {
				logger.silly( `Retrieved user ${user.getId( 'main' )} for Local Username ID ${username.id}` );
				return done( undefined, user );
			} else {
				try {
					const createdUser = await User.insert( { email: username.id, authorizations: EAuthorization.User } );
					if ( !createdUser ) {
						throw new Error( 'Could not create a new user' );
					}
					logger.verbose( `Created new user ${createdUser.getId( 'main' )} for Github ID ${username.id}` );
					return done( undefined, createdUser );
				} catch ( e ) {
					logger.error( `An error occured when creating user for Github ID ${username.id}: ${e.message}` );
					return done( e, undefined );
				}
			}
		},
	) );
}

const createToken = ( auth: any ) =>
	sign(
		{ id: auth.id },
		backConfig.tokenSecret,
		{ expiresIn: 60 * 120 },
	);

const generateToken = ( req: express.Request, res: express.Response, next: express.NextFunction ) => {
	req.token = createToken( req.auth );
	next();
};

const sendToken = ( req: express.Request, res: express.Response ) => {
	if ( !req.token ) {
		const message = 'Missing token';
		logger.error( `An error occured when setting user session: ${message}` );
		throw new Error( message );
	}
	req.session = assign( req.session, { auth: req.auth, token: req.token } );
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
			if ( req.session && req.session.token ) {
				logger.debug( `User with IP ${req.ip} is authenticated with session id ${req.session.token}` ); // Is it RGPD compliant ?
				return res.status( 200 ).json( { token: req.session.token } );
			} else {
				logger.debug( `User with IP ${req.ip} is NOT authenticated` ); // Is it RGPD compliant ?
				return res.status( 401 ).send( 'Unauthenticated' );
			}
		},
	);

	// GET /auth/google
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Google authentication will involve
	//   redirecting the user to google.com.  After authorization, Google
	//   will redirect the user back to this application at /auth/google/callback
	app.get(
		`${backConfig.common.back.auth.baseAuthRoute}/google`,
		passport.authenticate( 'google', {
			scope: [
			'email',
			'profile',
			],
		} ),
	);
	
	if ( authConfig.google ) {
		// GET /auth/google/callback
		//   Use passport.authenticate() as route middleware to authenticate the
		//   request.  If authentication fails, the user will be redirected back to the
		//   login page.  Otherwise, the primary route function function will be called,
		//   which, in this example, will redirect the user to the home page.
		app.get(
			authConfig.google.redirectUrl,
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
			sendToken,
		);
	}

	app.get(
		`${backConfig.common.back.auth.baseAuthRoute}/github`,
		passport.authenticate( 'github', {
			scope: [
				'email',
				'profile',
			],
		} ),
	);

	if ( authConfig.github ) {
		// GET /auth/github/callback
		//   Use passport.authenticate() as route middleware to authenticate the
		//   request.  If authentication fails, the user will be redirected back to the
		//   login page.  Otherwise, the primary route function function will be called,
		//   which, in this example, will redirect the user to the home page.
		app.get(
			authConfig.github.redirectUrl,
			passport.authenticate( 'github', { failureRedirect: '/login' } ),
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
			sendToken,
		);
	}
};
