import category from  './category'
import product from './product'
import blockContent from './blockContent'
import { user, account } from 'next-auth-sanity/schemas';



export const schemaTypes = [category, product, blockContent, user, account]
