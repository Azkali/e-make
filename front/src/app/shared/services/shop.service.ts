import { IProduct, product } from '../../../../../cross/models/product';
import { products } from '../../../../../cross/mocks/product';
/// USE Diaspora.dataSources.s3dpAPI.adapter.store.Model.items in Browser console to fetch ittems
import { Injectable } from '@angular/core';

import { Diaspora, Model, EFieldType, Adapter } from '@diaspora/diaspora';
import { environment } from '../../../environments/environment';
import DataAccessLayer = Adapter.DataAccessLayer;
import { AsyncSubject } from 'rxjs/AsyncSubject';

const mainDataSourceName = 'main';

export enum EReadyState {
	Waiting,
	Error,
	Ready,
}

@Injectable()
export class ShopService {
	private dataSource: DataAccessLayer;
	private Product: Model<IProduct>;
	public readonly readyState: AsyncSubject<any>;

	public constructor() {
		console.log( environment );
		this.readyState = new AsyncSubject<any>();

		if ( environment.production === true ) {
			this.dataSource = Diaspora.createNamedDataSource(
				mainDataSourceName,
				'webApi', // =====> wepApi <======
				{
					host: 'TODO',
					port: 8000,
					path: 'TODO',
				} );
			} else {
				( window as any ).Diaspora = Diaspora;
				this.dataSource = Diaspora.createNamedDataSource(
					mainDataSourceName,
					'inMemory'
					);
				}

		this.Product = Diaspora.declareModel<IProduct>(
					'Product',
					{
						sources: mainDataSourceName,
						attributes: product,
					}
					);

		if ( environment.production === false ) {
						this.dataSource.waitReady()
						.then( () => this.Product.insertMany( products ) )
						.then( () => this.readyState.complete() )
						.catch( err => this.readyState.error( err ) );
					} else {
						this.dataSource.waitReady()
						.then( () => this.readyState.complete() )
						.catch( err => this.readyState.error( err ) );
					}
				}

	public async getAllProducts() {
					return this.Product.findMany();
				}
			}

