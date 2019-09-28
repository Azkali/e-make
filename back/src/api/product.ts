import { Product } from '../models';
import { buildMiddlewares } from './utils';

export const { batch: batchProductsMiddleware, single: singleProductMiddleware } = buildMiddlewares( Product );
