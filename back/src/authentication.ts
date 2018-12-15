import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import express = require( 'express' );
import { User } from './models';
import { IUser, EAuthorization } from '../../cross/models';
import { Entity } from '@diaspora/diaspora/dist/types';
import { sign } from 'jsonwebtoken';
import { oauthConfigGoogle, backConfig, frontConfig } from './configs';

// Load configs
passport.use( new GoogleStrategy(
	{
		clientID: oauthConfigGoogle.appId,
		clientSecret: oauthConfigGoogle.appSecret,
		callbackURL: `${backConfig.domainName}${backConfig.port ? ':' + backConfig.port : ''}${oauthConfigGoogle.redirectUrl}`,
	},
	async ( accessToken, refreshToken, profile, done ) => {
		console.log( {accessToken, refreshToken, profile} );
		const user = await User.find( { googleId: profile.id } );
		console.info( 'Logging in user', user );
		if ( user ){
			return done( undefined, user );
		} else {
			try{
				const createdUser = await User.insert( { googleId: profile.id, authorizations: EAuthorization.User } );
				if ( !createdUser ){
					throw new Error( 'Could not create a new user' );
				}
				console.log( 'New user created:', createdUser );
				return done( undefined, createdUser );
			} catch ( e ){
				return done( e, undefined );
			}
		}
	}
) );

passport.serializeUser( async ( user: Entity<IUser & {id: any}>, done: ( err: Error | null, user: any ) => void ) => {
	done( null, user.getProperties( 'main' ) );
} );

passport.deserializeUser( async ( user: IUser & {id: any}, done: ( err: Error | null, user: any ) => void ) => {
	done( null, await User.find( user.id ) );
} );

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
		throw new Error( 'Missing token' );
	}
	res.setHeader( 'x-auth-token', req.token );
	res.status( 200 ).send( req.auth );
};

export const initializePassport = ( app: express.Express ) => {// GET /auth/google
	app.use( passport.initialize() );
	app.use( passport.session() );
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Google authentication will involve
	//   redirecting the user to google.com.  After authorization, Google
	//   will redirect the user back to this application at /auth/google/callback
	app.get(
		'/auth/google',
		passport.authenticate( 'google', { scope: ['https://www.googleapis.com/auth/plus.login'] } )
	);
	
	// GET /auth/google/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get(
		oauthConfigGoogle.redirectUrl,
		passport.authenticate( 'google', { failureRedirect: '/login' } ),
		( req, res, next ) => {
			if ( !req.user ) {
				return res.sendStatus( 401 );
			}
		
			// prepare token for API
			req.auth = {
				id: req.user.id,
			};
		
			next();
		},
		generateToken,
		sendToken,
		( req, res ) => {
			res.redirect( frontConfig.domainName + ( frontConfig.port ? ':' + frontConfig.port : '' ) );
		}
	);
};
