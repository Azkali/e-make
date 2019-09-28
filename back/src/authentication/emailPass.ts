/// <reference path="../types/index.d.ts"/>

import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { backConfig } from '../../cross/config/environments/loader';
import { EAuthorization } from '../../cross/models';
import { logger } from '../logger';
import { User } from '../models';

// Took and adapted from : https://medium.com/gomycode/authentication-with-passport-js-73ca65b25feb
passport.use( 'local-signin', new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	async ( username, password, done ) => {
		const user = await User.find( { username } );
		logger.info( 'Logging in user for Username ID: ' + username );
		if ( user && user.attributes ) {
			logger.silly( `Retrieved user ${user.getId( 'main' )} for Username ID ${username}` );
			try {
				if ( password === user.attributes.password ) {
					await bcrypt.compare( password, user.attributes.password );
					return done( undefined, user, { message: 'Logged in' } );
				}
			} catch ( e ) {
				logger.error( `An error occured when creating user for USername ID ${user}: ${e.message}` );
				return done( e );
			}
			return done( undefined, user, { message: 'Unable to login' } );

		} else {
			throw new Error( 'Couldn\'t find a valid user' );
		}
	},
) );

passport.use( 'local-signup', new LocalStrategy( {
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true, // allows us to pass back the entire request to the callback
},                                               async ( req, email, password, done ) => {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		const user = await User.find( { email } );

			// check to see if theres already a user with that email
		if ( user ) {
			return done( null, false, { message: ( 'That email is already taken.' ) } );
		} else {
			// if there is no user with that email
			// create the user
			if ( user !== null ) {
				// To be completed by @GerkinDev

				await bcrypt.hash( password, '' );
				throw new Error( 'Not implemented' );
			}
		}
	} ) );
