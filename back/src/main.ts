import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressSession from 'express-session';
import { castArray } from 'lodash';

import { ExpressApiGenerator } from '@diaspora/plugin-server';

import { initializePassport } from './authentication';
import { logger } from './logger';
import './models';
import { Attribute, AttributeCategory, mainDataSource, Product } from './models';
import { quoteAction } from './quoteAction';
import { writeOnlyForAdmin } from './security';

import { Server } from 'http';
import { backConfig } from '../cross/config/environments/loader';
import { makeAbsoluteUrlsNoRelativeProtocol } from '../cross/config/utils';
import { loadMocks } from '../cross/mocks/loadMocks';

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
/*
app.use( ( req, res, next ) => {
	res.header( 'Access-Control-Allow-Origin', makeAbsoluteUrl( backConfig.common.front ) );
	res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
	next();
} );
*/
app.use( cookieParser() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( expressSession( {
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	cookie: backConfig.sessionCookie,
} ) );

const removeScheme = ( url: string ) => url.replace( /https?:\/\//, '' );

const CORS_HOSTS = [
	...makeAbsoluteUrlsNoRelativeProtocol( backConfig.common.front ),
	...makeAbsoluteUrlsNoRelativeProtocol( backConfig.common.back ),
];
const getCorsHost = ( req: express.Request ) => {
	const reqHost = castArray( req.headers.origin )[0] || '';
	const hostIndex = CORS_HOSTS.indexOf( reqHost );
	if ( hostIndex !== -1 ) {
		return reqHost;
	}
	return undefined;
};
app.use( ( req, res, next ) => {
	res.header( 'Access-Control-Allow-Credentials', 'true' );
	const corsHost = getCorsHost( req );
	if ( corsHost ) {
		res.header( 'Access-Control-Allow-Origin', corsHost );
	} else {
		logger.debug( `A request came from a non-allowed origin. Request origin: ${req.headers.origin}, accepted: ${CORS_HOSTS.map( v => `"${v}"` ).join( ', ' )}` );
	}
	res.header( 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE' );
	res.header( 'Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept' );
	next();
} );

// Auth routes
initializePassport( app );
// Initialize the API
app.use( backConfig.common.back.apiBaseUrl, apiMiddleware.middleware );

mainDataSource.waitReady()
	.then( () => loadMocks( 'main', AttributeCategory, Attribute, Product ) )
	.then( async () => {
		logger.debug( `Accepted CORS FQDN are ${CORS_HOSTS.map( v => `"${v}"` ).join( ', ' )}.` );
		const port = backConfig.common.back.port || 80;
		const loggableHost = backConfig.host || '(unspecified)';

		return new Promise<Server>( ( resolve, reject ) => {
			const httpServer = app.listen( port, backConfig.host, () => {
				logger.info( `E-Make API listening on "${loggableHost}":${port}!` );
				return resolve( httpServer );
			} ).on( 'error', e =>
				reject( new Error( `An error occured while starting the server on "${loggableHost}":${port}: ${e.message || e}` ) ) );
		} );
	} )
	.catch( e => {
		logger.error( `Failed to start E-Make API! ${e}` );
	} );

app.post( '/quote', [bodyParser.json(), quoteAction] );
