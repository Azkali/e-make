import { Diaspora } from '@diaspora/diaspora';
import { ExpressApiGenerator } from '@diaspora/plugin-server';
import express = require( 'express' );

import {product} from '../cross/models/product';

Diaspora.createNamedDataSource( 'main', 'inMemory' );
Diaspora.declareModel( 'Product', {
	sources: 'main',
	attributes: product,
} );

const apiMiddleware = new ExpressApiGenerator( {
	webserverType: 'express',
	models: {
		Product: true,
	},
} );

  
const app = express();
app.use( '/api', apiMiddleware.middleware );

const port = 8765;
const host = '0.0.0.0';
const httpServer = app.listen( port, host, () => {
	console.log( `Example app listening on port ${port}!` );
} );
