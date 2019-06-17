import { OAuth2Strategy as GitHubStrategy } from 'passport-github';
import { backConfig } from '../../cross/config/environments/loader';
import passport from 'passport';
import { User } from '../models';
import { logger } from '../logger';
import {  EAuthorization } from '../../cross/models';
import { makeAbsoluteUrl } from '../../cross/config/utils';

const oauthConfig = backConfig.oauth;

if ( oauthConfig.github ) {
	passport.use( new GitHubStrategy(
		{
			clientID: oauthConfig.github.appId,
			clientSecret: oauthConfig.github.appSecret,
			callbackURL: makeAbsoluteUrl( backConfig.common.back ) + oauthConfig.github.redirectUrl,
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