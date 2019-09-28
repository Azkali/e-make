import { Attribute } from '../models';
import { buildMiddlewares } from './utils';

export const { batch: batchAttributesMiddleware, single: singleAttributeMiddleware } = buildMiddlewares( Attribute );
