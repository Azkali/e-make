import express from 'express';

import { batchAttributesMiddleware, singleAttributeMiddleware } from './attribute';
import { batchAttributeCategoriesMiddleware, singleAttributeCategoryMiddleware } from './attributeCategory';
import { batchProductsMiddleware, singleProductMiddleware } from './product';

export const apiMiddleware = express.Router();
apiMiddleware.use( '/product', singleProductMiddleware );
apiMiddleware.use( '/products', batchProductsMiddleware );

apiMiddleware.use( '/attribute-category', singleAttributeCategoryMiddleware );
apiMiddleware.use( '/attribute-categories', batchAttributeCategoriesMiddleware );

apiMiddleware.use( '/attribute', singleAttributeMiddleware );
apiMiddleware.use( '/attributes', batchAttributesMiddleware );
