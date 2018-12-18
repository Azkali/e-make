import { Injectable } from '@angular/core';
import { Diaspora, Model, Adapter, Set, EntityUid, Entity } from '@diaspora/diaspora';
import { IEntityProperties } from '@diaspora/diaspora/dist/types/types/entity';
import DataAccessLayer = Adapter.DataAccessLayer;
import { from, BehaviorSubject, AsyncSubject, forkJoin } from 'rxjs';
import * as _ from 'lodash';

import { IProductViewModel } from './shop.service';
import { IEntry } from './../models/markdown-config';
import { environment } from '../../../environments/environment';
import { MarkdownScrapperService, IProductArticle, IArticle } from './markdown-scrapper.service';
import { loadMocks } from '../../../../../cross/mocks/loadMocks';

import { IProduct, product as ProductAttributes } from '../../../../../cross/models/product';
import { IAttribute, attribute as AttributeAttributes } from '../../../../../cross/models/attribute';
import { IAttributeCategory, attributeCategory as AttributeCategoryAttributes } from '../../../../../cross/models/attributeCategory';
import { ICart, cart as CartAttributes, ITempCart } from '../../../../../cross/models/cart';
import { ICartItem, cartItem as CartItemAttributes } from '../../../../../cross/models/cartItem';
import { ACookieDependentService } from './ICookieDependentService';

const serverDataSourceName = 'remote';
const localDataSourceName = 'local';
const tempDataSourceName = 'temp';

export enum EReadyState {
	Waiting,
	Error,
	Ready,
}

export interface IProductViewModel extends IProduct, IProductArticle, IEntityProperties {
	minimumPrice: number;
	customizableParts: Array<IProduct.IPart & {
		category: IAttributeCategory & IEntityProperties & {
			attributes: Array<IAttribute & IEntityProperties>;
		};
	}>;
}

const COOKIE_KEY = 'localcart';

@Injectable( {
	providedIn: 'root',
} )
export class ShopService extends ACookieDependentService {
	public get cookieAccepted() {
		return ACookieDependentService.hasCookie( COOKIE_KEY );
	}
	public set cookieAccepted( accepted: boolean ) {
		if ( accepted ) {
			ACookieDependentService.setCookie( COOKIE_KEY, 'y' );
		} else {
			ACookieDependentService.deleteCookie( COOKIE_KEY );
		}
		this.refreshCart();
	}

	public constructor( private markdownScrapperService: MarkdownScrapperService ) {
		super();

		this.readyState = new AsyncSubject<any>();

		if ( environment.production === true ) {
			this.serverDataSource = Diaspora.createNamedDataSource( serverDataSourceName, 'webApi', {
				host: 'TODO',
				port: 8000,
				path: 'TODO',
			} );
			this.localDataSource = Diaspora.createNamedDataSource( localDataSourceName, 'webStorage' );
		} else {
			( window as any ).Diaspora = Diaspora;
			this.serverDataSource = Diaspora.createNamedDataSource( serverDataSourceName, 'inMemory' );
			this.localDataSource = Diaspora.createNamedDataSource( localDataSourceName, 'webStorage' );
		}
		this.tempDataSource = Diaspora.createNamedDataSource( tempDataSourceName, 'inMemory' );

		this.Product = Diaspora.declareModel<IProduct>( 'Product', {
			sources: serverDataSourceName,
			attributes: ProductAttributes,
		} );
		this.AttributeCategory = Diaspora.declareModel<IAttributeCategory>( 'AttributeCategory', {
			sources: serverDataSourceName,
			attributes: AttributeCategoryAttributes,
		} );
		this.Attribute = Diaspora.declareModel<IAttribute>( 'Attribute', {
			sources: serverDataSourceName,
			attributes: AttributeAttributes,
		} );
		this.Cart = Diaspora.declareModel<ICart>( 'Cart', {
			sources: serverDataSourceName,
			attributes: CartAttributes,
		} );
		this.CartItem = Diaspora.declareModel<ICartItem>( 'CartItem', {
			sources: [serverDataSourceName, localDataSourceName, tempDataSourceName],
			attributes: CartItemAttributes,
		} );

		const waitInitPromise = Promise.all( [
			this.serverDataSource.waitReady(),
			this.localDataSource.waitReady(),
		] ).then( async () => {
			if ( environment.production === false ) {
				await loadMocks( serverDataSourceName, this.AttributeCategory, this.Attribute, this.Product );
			}
			await this.refreshCart();
		} );
		waitInitPromise
			.then( () => this.readyState.complete() )
			.catch( err => this.readyState.error( err ) );

		this.readyState.subscribe(
			() => console.info( 'Data source readyState: Next' ),
			err => console.error( 'Data source readyState: Error', err ),
			() => console.info( 'Data source readyState: Complete' )
		);
	}

	private get cartDataSource() {
		if ( false ) { // If user logged in, use server
			return serverDataSourceName;
		} else if ( this.cookieAccepted ) {
			return localDataSourceName;
		} else {
			return tempDataSourceName;
		}
		return localDataSourceName;
	}

	private serverDataSource: DataAccessLayer;
	private localDataSource: DataAccessLayer;
	private tempDataSource: DataAccessLayer;
	private Product: Model<IProduct>;
	private AttributeCategory: Model<IAttributeCategory>;
	private Attribute: Model<IAttribute>;
	private Cart: Model<ICart>;
	private CartItem: Model<ICartItem>;

	public readonly currentCart = new BehaviorSubject<ITempCart>( {
		totalSum: 0,
		totalCount: 0,
		items: [],
	} );
	public readonly readyState: AsyncSubject<any>;

	public static getTotalPrice( product: IProductViewModel, choosenAttributes: _.Dictionary<EntityUid> ) {
		return product.basePrice + _.sumBy( product.customizableParts, part => {
			const attributes: IAttribute & IEntityProperties = part.category.attributes as any;
			return part.factor * attributes.find( attr => attr.id === choosenAttributes[part.name] ).price;
		} );
	}

	private async populateCustomizableParts( parts?: IProduct.IPart[] ) {
		if ( parts ) {
			return ( await Promise.all( parts.map( async part =>
				Promise.all( [
					part,
					this.AttributeCategory.find( { id: part.categoryId} ),
					this.Attribute.findMany( { categoryId: part.categoryId} ),
				] ) ) ) ).map( ( [part, attributeCategory, attributes] ) => {
					const attributeCategoryAttributes = _.assign( attributeCategory.getProperties( serverDataSourceName ), {
						attributes: attributes.toChainable( Set.ETransformationMode.PROPERTIES, serverDataSourceName ).value(),
					} );
					return _.assign( part, {
						category: attributeCategoryAttributes,
					} );
				} );
		} else {
			return [];
		}
	}

	private async assembleProductViewModel( productAttributes: IProduct & IEntityProperties, entries: IEntry[], summaries: IArticle[] ) {
		const entry: IEntry = _.find<IEntry | undefined>( entries, entryProduct =>
			entryProduct.path.replace( /^(?:.*?\/)?(.*)\.md$/, '$1' ) === productAttributes.name ) || {path: '404', type: 'not-found'};
		const summary: IArticle = _.find<IArticle | undefined>( summaries, {title: productAttributes.name} ) || {
			title: '',
			summary: 'No summary yet !',
		};

		const customizableParts = await this.populateCustomizableParts( productAttributes.customizableParts );
		const output: IProductViewModel = _.assign( {}, summary, productAttributes, {
			pathProductPage: MarkdownScrapperService.getRawContentUrl( `products/${productAttributes.name}/product-page.md` ),
			pathArticle: MarkdownScrapperService.getRawContentUrl( `products/${productAttributes.name}/article.md` ),
			minimumPrice: productAttributes.basePrice + _.sumBy( customizableParts, part => {
				console.log( part );
				const cheapestAttribute = _.chain( part.category.attributes ).minBy( 'price' ).value();
				return part.factor * cheapestAttribute.price;
			} ),
			customizableParts,
		} );
		return output;
	}

	public geProductByName( productName: string ) {
		const productObservable = new AsyncSubject<IProductViewModel>();
		this.readyState
			.subscribe( null, null, () => {
				forkJoin( this.markdownScrapperService.getProductArticles(), from( this.Product.find( {name: productName} ) ) )
				.subscribe( async ( [productArticles, product] ) => {
					const props = product.getProperties( serverDataSourceName );
					const viewModel = await this.assembleProductViewModel( props, productArticles.entries, productArticles.summaries );
					productObservable.next( viewModel );
					productObservable.complete();
				} );
			} );
		if ( environment.production === false ) {
			productObservable.subscribe( console.info.bind( this, `Product ${productName} fetched:` ) );
		}
		return productObservable;
	}

	public getAllProducts() {
		const allProductsObservable = new AsyncSubject<IProductViewModel[]>();
		this.readyState
			.subscribe( null, null, () => {
				forkJoin( this.markdownScrapperService.getProductArticles(), from( this.Product.findMany() ) )
				.subscribe( async ( [productArticles, retrievedProducts] ) => {
					const allProducts = await Promise.all( retrievedProducts
						.toChainable( Set.ETransformationMode.PROPERTIES, serverDataSourceName )
						.map( props => this.assembleProductViewModel( props, productArticles.entries, productArticles.summaries ) )
						.value()
					);
					allProductsObservable.next( allProducts );
					allProductsObservable.complete();
				} );
			} );
		if ( environment.production === false ) {
			allProductsObservable.subscribe( console.info.bind( this, 'All products fetched:' ) );
		}
		return allProductsObservable;
	}

	public async fetchItem( item: {
			attributeId: EntityUid;
			attribute?: IAttribute;
		} | {
			productId: EntityUid;
			product: IProduct;
			attributesIds: _.Dictionary<EntityUid>;
			attributes?: _.Dictionary<IAttribute>;
	} ) {
		if ( item.hasOwnProperty( 'attributeId' ) ) {
			console.log( 'Fetching attr', item );
			const itemAttr = item as {
				attribute?:IAttribute;
				attributeId:EntityUid;
			};
			const fetchedAttribute = await this.Attribute.find( itemAttr.attributeId );
			return {
				attributeId: itemAttr.attributeId,
				attribute: fetchedAttribute ? fetchedAttribute.getProperties( serverDataSourceName ) : undefined,
			} as {
				attribute?:IAttribute & IEntityProperties;
				attributeId:EntityUid;
			};
		} else {
			console.log( 'Fetching prod', item );
			const itemProd = item as {
				productId: EntityUid;
				product: IProduct;
				attributesIds: _.Dictionary<EntityUid>;
				attributes?: _.Dictionary<IAttribute>;
			};

			const attrsPairs = _.toPairs( itemProd.attributesIds );
			const attrsPromises = attrsPairs.map( ( [,attrId] ) => this.Attribute.find( attrId ) );
			const fetchedComponents = await Promise.all( [
				this.Product.find( itemProd.productId ),
				Promise.all( attrsPromises ),
			] );
			const attrsProps = fetchedComponents[1].map( attr => attr ? attr.getProperties( serverDataSourceName ) : undefined );
			return {
				productId: itemProd.productId,
				product: fetchedComponents[0] ? fetchedComponents[0].getProperties( serverDataSourceName ) : undefined,
				attributesIds: itemProd.attributesIds,
				attributes: _.zipObject( attrsPairs.map( pair => pair[0] ), attrsProps ),
			} as {
				productId: EntityUid;
				product: IProduct & IEntityProperties;
				attributesIds: _.Dictionary<EntityUid>;
				attributes?: _.Dictionary<IAttribute & IEntityProperties>;
			};
		}
	}

	private async refreshCart() {
		const cartItems = ( await this.CartItem.findMany( undefined, undefined, this.cartDataSource ) )
			.toChainable( Set.ETransformationMode.ATTRIBUTES )
			.value();
		console.log( {cartItems} );
		const cartObject = {
			totalSum: _.sumBy( cartItems, item => item.unitPrice * item.count ),
			totalCount: _.sumBy( cartItems, item => item.count ),
			items: cartItems,
		};
		this.currentCart.next( cartObject );
	}
	private async addItemToCart( item: ICartItem ) {
		await this.CartItem.insert( item, this.cartDataSource );
		await this.refreshCart();
	}

	public async addProductToCart( product: IProductViewModel, choosenAttributes: _.Dictionary<EntityUid> ) {
		return this.addItemToCart( {
			count: 1,
			unitPrice: ShopService.getTotalPrice( product, choosenAttributes ),
			item: {
				productId: product.id,
				product,
				attributesIds: choosenAttributes,
			},
		} );
	}

	public async addAttributeToCart( attribute: IAttribute & IEntityProperties ) {
		return this.addItemToCart( {
			count: 1,
			unitPrice: attribute.price,
			item: {
				attributeId: attribute.id,
				attribute,
			},
		} );
	}
}
