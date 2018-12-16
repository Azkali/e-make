import { Injectable } from '@angular/core';
import { Diaspora, Model, EFieldType, Adapter, Set } from '@diaspora/diaspora';
import DataAccessLayer = Adapter.DataAccessLayer;
import { from, BehaviorSubject, Subject, AsyncSubject, forkJoin } from 'rxjs';
import * as _ from 'lodash';

import { IProductViewModel } from './shop.service';
import { IEntry } from './../models/markdown-config';
import { IProduct, product as ProductAttributes } from '../../../../../cross/models/product';
import { IAttribute, attribute as AttributeAttributes } from '../../../../../cross/models/attribute';
import { IAttributeCategory, attributeCategory as AttributeCategoryAttributes } from '../../../../../cross/models/attributeCategory';
import { environment } from '../../../environments/environment';
import { MarkdownScrapperService, IProductArticle, IArticle } from './markdown-scrapper.service';
import { loadMocks } from '../../../../../cross/mocks/loadMocks';

const mainDataSourceName = 'main';

export enum EReadyState {
	Waiting,
	Error,
	Ready,
}

export interface IProductViewModel extends IProduct, IProductArticle {}


@Injectable( {
	providedIn: 'root',
} )
export class ShopService {

	public constructor( private markdownScrapperService: MarkdownScrapperService ) {
		console.log( environment );
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
			() => console.info( 'readyState: Next' ),
			err => console.error( 'readyState: Error', err ),
			() => console.info( 'readyState: Complete' )
		);
	}
	private dataSource: DataAccessLayer;
	private Product: Model<IProduct>;
	private AttributeCategory: Model<IAttributeCategory>;
	private Attribute: Model<IAttribute>;
	public readonly readyState: AsyncSubject<any>;

	private async;
	public getAllProducts() {
		const allProductsObservable = new AsyncSubject<IProductViewModel[]>();
		this.readyState
			.subscribe( null, null, () => {
				console.log( 'Ready state OK' );
				forkJoin( this.markdownScrapperService.getProductArticles(), from( this.Product.findMany() ) )
				.subscribe( ( [productArticles, retrievedProducts] ) => {
					const allProducts = retrievedProducts
						.toChainable( Set.ETransformationMode.ATTRIBUTES )
						.map( productEntity => {
							const entry: IEntry = _.find<IEntry | undefined>( productArticles.entries, entryProduct =>
								entryProduct.path.replace( /^(?:.*?\/)?(.*)\.md$/, '$1' ) === productEntity.name ) || {path: '404', type: 'not-found'};
							const summary: IArticle = _.find<IArticle | undefined>( productArticles.summaries, {title: productEntity.name} ) || {
								title: '',
								summary: 'No summary yet !',
							};
							const output: IProductViewModel = _.assign( {}, summary, {
								pathProductPage: MarkdownScrapperService.getRawContentUrl( `products/${productEntity.name}/product-page.md` ),
								pathArticle: MarkdownScrapperService.getRawContentUrl( `products/${productEntity.name}/article.md` ),
							}, 	                                        productEntity );
							return output;
						} )
						.value();
					allProductsObservable.next( allProducts );
					allProductsObservable.complete();
				} );
			} );
		return allProductsObservable;
	}
}


