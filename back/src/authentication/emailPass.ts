/// <reference path="../types/index.d.ts"/>

import { OAuth2Strategy as LocalStrategy } from 'passport-local';
import { backConfig } from '../../cross/config/environments/loader';
import passport from 'passport';
import { User } from '../models';
import { logger } from '../logger';
import {  EAuthorization } from '../../cross/models';
import { comparePassword } from './index';

const oauthConfig = backConfig.oauth;

// Took and adapted from : https://medium.com/gomycode/authentication-with-passport-js-73ca65b25feb
if ( oauthConfig.emailPass ) {
	passport.use( new LocalStrategy(
		{
			emailField: oauthConfig.emailPass.emailField,
			passwordField: oauthConfig.emailPass.passwordField,
		},
		async ( username, password, done ) => {
			const user = await User.find( { username } );
			logger.info( 'Logging in user for Username ID: ' + username.id );
			if ( user ) {
				logger.silly( `Retrieved user ${user.getId( 'main' )} for Username ID ${username.id}` );
				comparePassword(password, user.attributes.password, ( err, isMatch ) => {
					if( !isMatch ) {
						throw new Error( 'Invalid password' );
					}
				});
				return done( undefined, user );

			} else {
				try {
					const createdUser = await User.insert( { email: username.id, authorizations: EAuthorization.User } );
					if ( !createdUser ) {
						throw new Error( 'Could not create a new user' );
					}
					logger.verbose( `Created new user ${createdUser.getId( 'main' )} for Username ID ${username.id}` );
					return done( undefined, createdUser );
				} catch ( e ) {
					logger.error( `An error occured when creating user for USername ID ${username.id}: ${e.message}` );
					return done( e, undefined );
				}
			}
		},
	) );
}