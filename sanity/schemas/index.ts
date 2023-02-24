import category from  './category'
import product from './product'
import blockContent from './blockContent'
import order from './order';
import { user, account } from 'next-auth-sanity/schemas';
import parentProduct from './parentProduct';



export const schemaTypes = [category, parentProduct, product, order, blockContent, user, account]
