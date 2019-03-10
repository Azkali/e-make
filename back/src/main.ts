import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import { castArray } from 'lodash';

import { ExpressApiGenerator } from '@diaspora/plugin-server';

import './models';
import { quoteAction } from './quoteAction';
import { logger } from './logger';
import { initializePassport } from './authentication';
import { mainDataSource, AttributeCategory, Product, Attribute } from './models';
import { writeOnlyForAdmin } from './security';

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
	cookie: {
		domain: 'e-make.io',
		maxAge: 1000 * 60 * 60 * 24 * 30 * 12, 
	},
} ) );

const removeScheme = ( url:string ) => url.replace( /https?:\/\//, '' );

const CORS_HOSTS = [
	...makeAbsoluteUrlsNoRelativeProtocol( backConfig.common.front ),
	...makeAbsoluteUrlsNoRelativeProtocol( backConfig.common.back ),
];
const getCorsHost = ( req: express.Request ) => {
	const reqHost = castArray( req.headers.origin )[0] || '';
	const hostIndex = CORS_HOSTS.indexOf( reqHost );
	if ( hostIndex !== -1 ){
		return reqHost;
	}
	return undefined;
};
app.use( ( req, res, next ) => {
	res.header( 'Access-Control-Allow-Credentials', 'true' );
	const corsHost = getCorsHost( req );
	if ( corsHost ){
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
	.then( () => {
		const httpServer = app.listen( backConfig.common.back.port || 80, backConfig.host, () => {
			logger.info( `E-Make API listening on ${backConfig.host}:${backConfig.common.back.port || 80}!` );
			logger.debug( `Accepted CORS FQDN are ${CORS_HOSTS.map( v => `"${v}"` ).join( ', ' )}.` );
		} );
		return httpServer;
	} )
	.catch( e => {
		logger.crit( `Failed to start E-Make API! ${e}` );
	} );

app.post( '/quote', [bodyParser.json(), quoteAction] );
