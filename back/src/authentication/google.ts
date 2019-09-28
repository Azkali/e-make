import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { backConfig } from '../../cross/config/environments/loader';
import { makeAbsoluteUrl } from '../../cross/config/utils';
import {  EAuthorization } from '../../cross/models';
import { logger } from '../logger';
import { User } from '../models';

const oauthConfig = backConfig.authMethods;

// Load configs
if ( oauthConfig.google ) {
	passport.use( new GoogleStrategy(
		{
			clientID: oauthConfig.google.appId,
			clientSecret: oauthConfig.google.appSecret,
			callbackURL: makeAbsoluteUrl( backConfig.common.back ) + oauthConfig.google.redirectUrl,
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
