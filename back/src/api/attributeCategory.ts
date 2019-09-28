import { AttributeCategory } from '../models';
import { buildMiddlewares } from './utils';

export const { batch: batchAttributeCategoriesMiddleware, single: singleAttributeCategoryMiddleware } = buildMiddlewares( AttributeCategory );
