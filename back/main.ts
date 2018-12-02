import { Diaspora } from '@diaspora/diaspora';
import { ExpressApiGenerator } from '@diaspora/plugin-server';
import express = require( 'express' );

import {product, user, attributeCategory, attribute} from '../cross/models';

Diaspora.createNamedDataSource( 'main', 'inMemory' );
const Product = Diaspora.declareModel( 'Product', {
	sources: 'main',
	attributes: product,
} );
const User = Diaspora.declareModel( 'User', {
	sources: 'main',
	attributes: user,
} );
const AttributeCategory = Diaspora.declareModel( 'AttributeCategory', {
	sources: 'main',
	attributes: attributeCategory,
} );
const Attribute = Diaspora.declareModel( 'Attribute', {
	sources: 'main',
	attributes: attribute,
} );

const apiMiddleware = new ExpressApiGenerator( {
	webserverType: 'express',
	models: {
		Product: true,
		User: true,
		AttributeCategory: {
			plural: 'attributecategories',
		},
		Attribute: true,
	},
} );

  
const app = express();
app.use( '/api', apiMiddleware.middleware );

const backConfig = require( '../cross/config/local/back.json' );
const httpServer = app.listen( backConfig.port, backConfig.host, () => {
	console.log( `Example app listening on ${backConfig.host}:${backConfig.port}!` );
} );
