import { Injectable } from '@angular/core';
import { Diaspora, Model, Adapter, Set, EntityUid } from '@diaspora/diaspora';
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
import { ICart, cart as CartAttributes } from '../../../../../cross/models/cart';
import { ICartItem, cartItem as CartItemAttributes } from '../../../../../cross/models/cartItem';

const mainDataSourceName = 'main';

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


@Injectable( {
	providedIn: 'root',
} )
export class ShopService {

	public constructor( private markdownScrapperService: MarkdownScrapperService ) {
		this.readyState = new AsyncSubject<any>();

		if ( environment.production === true ) {
			this.dataSource = Diaspora.createNamedDataSource( mainDataSourceName, 'webApi', {
				host: 'TODO',
				port: 8000,
				path: 'TODO',
			} );
		} else {
			( window as any ).Diaspora = Diaspora;
			this.dataSource = Diaspora.createNamedDataSource( mainDataSourceName, 'inMemory' );
		}

		this.Product = Diaspora.declareModel<IProduct>( 'Product', {
			sources: mainDataSourceName,
			attributes: ProductAttributes,
		} );
		this.AttributeCategory = Diaspora.declareModel<IAttributeCategory>( 'AttributeCategory', {
			sources: mainDataSourceName,
			attributes: AttributeCategoryAttributes,
		} );
		this.Attribute = Diaspora.declareModel<IAttribute>( 'Attribute', {
			sources: mainDataSourceName,
			attributes: AttributeAttributes,
		} );
		this.Cart = Diaspora.declareModel<ICart>( 'Cart', {
			sources: mainDataSourceName,
			attributes: CartAttributes,
		} );
		this.CartItem = Diaspora.declareModel<ICartItem>( 'CartItem', {
			sources: mainDataSourceName,
			attributes: CartItemAttributes,
		} );

		if ( environment.production === false ) {
			this.dataSource.waitReady()
			.then( () => loadMocks( mainDataSourceName, this.AttributeCategory, this.Attribute, this.Product ) )
			.then( () => this.readyState.complete() )
			.catch( err => this.readyState.error( err ) );
		} else {
			this.dataSource.waitReady()
			.then( () => this.readyState.complete() )
			.catch( err => this.readyState.error( err ) );
		}

		this.readyState.subscribe(
			() => console.info( 'Data source readyState: Next' ),
			err => console.error( 'Data source readyState: Error', err ),
			() => console.info( 'Data source readyState: Complete' )
		);
	}

	private dataSource: DataAccessLayer;
	private Product: Model<IProduct>;
	private AttributeCategory: Model<IAttributeCategory>;
	private Attribute: Model<IAttribute>;
	private Cart: Model<ICart>;
	private CartItem: Model<ICartItem>;

	public readonly currentCart = new BehaviorSubject<ICart>( {
		totalSum: 0,
		totalCount: 0,
		itemIds: [],
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
					const attributeCategoryAttributes = _.assign( attributeCategory.getProperties( mainDataSourceName ), {
						attributes: attributes.toChainable( Set.ETransformationMode.PROPERTIES, mainDataSourceName ).value(),
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
					const props = product.getProperties( mainDataSourceName );
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
						.toChainable( Set.ETransformationMode.PROPERTIES, mainDataSourceName )
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

	private setNewCart( cart: ICart ) {
		cart.totalSum = _.sumBy( cart.items, item => item.unitPrice * item.count );
		cart.totalCount = _.sumBy( cart.items, item => item.count );
		this.currentCart.next( cart );
	}

	public addProductToCart( product: IProductViewModel, choosenAttributes: _.Dictionary<EntityUid> ) {
		const cart = this.currentCart.value;
		cart.items.push( {
			count: 1,
			unitPrice: ShopService.getTotalPrice( product, choosenAttributes ),
			item: {
				productId: product.id,
				product,
				attributesIds: {},
			},
		} );
		this.setNewCart( cart );
	}

	public addAttributeToCart( attribute: IAttribute & IEntityProperties ) {
		const cart = this.currentCart.value;
		cart.items.push( {
			count: 1,
			unitPrice: attribute.price,
			item: {
				attributeId: attribute.id,
				attribute,
			},
		} );
		this.setNewCart( cart );
	}
}
