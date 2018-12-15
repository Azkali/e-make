import { Entity } from '@diaspora/diaspora/dist/types';
import { initializePassport } from './authentication';
import { ExpressApiGenerator } from '@diaspora/plugin-server';
import express = require( 'express' );
import './models';
import { IUser, EAuthorization } from '../../cross/models';
import { mainDataSource } from './models';
import { backConfig } from './configs';

const isAuthenticated = ( req: express.Request, res: express.Response, next: () => void ) => {
	console.log( 'Checking authenticated' );
	if ( !req.isAuthenticated() || !req.user ){
		return res.sendStatus( 403 );
	}
	return next();
};
const isAdmin = ( req: express.Request, res: express.Response, next: () => void ) => {
	isAuthenticated( req, res, () => {
		console.log( 'Checking admin' );
		const user = ( req.user as Entity<IUser> ).attributes as IUser;
		if ( ( user.authorizations & EAuthorization.Admin ) !== EAuthorization.Admin ){
			return res.sendStatus( 403 );
		}
		return next();
	} );
};

const writeOnlyForAdmin = {
	insert: isAdmin,
	update: isAdmin,
	delete: isAdmin,
};

const apiMiddleware = new ExpressApiGenerator( {
	webserverType: 'express',
	models: {
		Product: {
			middlewares: writeOnlyForAdmin,
		},
		User: {
			middlewares: writeOnlyForAdmin,
		},
		AttributeCategory: {
			plural: 'attributecategories',
			middlewares: writeOnlyForAdmin,
		},
		Attribute: {
			middlewares: writeOnlyForAdmin,
		},
	},
} );

  
const app = express();
app.use( require( 'cookie-parser' )() );
app.use( require( 'body-parser' ).urlencoded( { extended: true } ) );
app.use( require( 'express-session' )( {
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
} ) );

// Auth routes
initializePassport( app );
// Initialize the API
app.use( '/api', apiMiddleware.middleware );

mainDataSource.waitReady().then( () => {
	const httpServer = app.listen( backConfig.port, backConfig.host, () => {
		console.log( `Example app listening on ${backConfig.host}:${backConfig.port}!` );
	} );
} );
