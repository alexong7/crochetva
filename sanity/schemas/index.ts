import category from  './category'
import product from './product'
import blockContent from './blockContent'
import order from './order';
import { user, account } from 'next-auth-sanity/schemas';



export const schemaTypes = [category, product, order, blockContent, user, account]
