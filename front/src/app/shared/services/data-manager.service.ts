/// USE Diaspora.dataSources.s3dpAPI.adapter.store.Model.items in Browser console to fetch ittems
import { Injectable } from '@angular/core';

import { Diaspora, Model, EFieldType, Adapter } from '@diaspora/diaspora';
import { environment } from '../../../environments/environment';
import { IProduct } from '../models/product';
import DataAccessLayer = Adapter.DataAccessLayer;

const product = require('../../mockData/Product.json');
const S3D = 's3dpAPI'


@Injectable()
export class DataManagerService {
    private dataSource: DataAccessLayer;
    private Product: Model<IProduct>;
    
    constructor() {
        console.log(environment);
        
        if (environment.production === true) {
            this.dataSource = Diaspora.createNamedDataSource(
                S3D,
                'webApi', // =====> wepApi <======3 
                {
                    host: 'localhost',
                    port: 8000,
                    path: '/api'
                });
        }

        else {
            this.dataSource = Diaspora.createNamedDataSource(
                S3D,
                'inMemory'
            );
        }

        this.Product = Diaspora.declareModel<IProduct>(
            'Product',
            {
                sources: S3D,
                attributes: {
                    $key: EFieldType.STRING,
                    title: EFieldType.STRING,
                    price: EFieldType.FLOAT,
                    category: EFieldType.STRING,
                    imageUrl: EFieldType.STRING
                }
            }
        );
        if (environment.production === false) {
            this.dataSource.waitReady().then(() => {
                return this.Product.insertMany(product);
            })
        }
    }
    
    async findItems() {
        if (environment.production === false) {
            return this.dataSource.waitReady().then(() => {
                return this.Product.insertMany(product);
            })
        }
    }
    async findItem() {
        if (environment.production === false) {
            return this.dataSource.waitReady().then(() => {
                return this.Product.find(product);
            })
        }
    }
    async insertItem() {
        if (environment.production === false) {
            return this.dataSource.waitReady().then(() => {
                return this.Product.insert(product);
            })
        }
    }

    async insertItems() {
        if (environment.production === false) {
            return this.dataSource.waitReady().then(() => {
                return this.Product.insertMany(product);
            })
        }
    }

    async delItem() {
        if (environment.production === false) {
            return this.dataSource.waitReady().then(() => {
                return this.Product.delete(this.Product);
            })
        }
    }
}