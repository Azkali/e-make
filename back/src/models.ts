import { Diaspora } from '@diaspora/diaspora';
import {product, user, attributeCategory, attribute, IProduct, IUser, IAttributeCategory, IAttribute, IQuote, quote, IAddress, address} from '../../cross/models';

export const mainDataSource = Diaspora.createNamedDataSource( 'main', 'inMemory' );
export const Product = Diaspora.declareModel<IProduct>( 'Product', {
	sources: 'main',
	attributes: product,
} );
export const User = Diaspora.declareModel<IUser>( 'User', {
	sources: 'main',
	attributes: user,
} );
export const AttributeCategory = Diaspora.declareModel<IAttributeCategory>( 'AttributeCategory', {
	sources: 'main',
	attributes: attributeCategory,
} );
export const Attribute = Diaspora.declareModel<IAttribute>( 'Attribute', {
	sources: 'main',
	attributes: attribute,
} );
export const Address = Diaspora.declareModel<IAddress>( 'Address', {
	sources: 'main',
	attributes: address,
} );
export const Quote = Diaspora.declareModel<IQuote>( 'Quote', {
	sources: 'main',
	attributes: quote,
} );
