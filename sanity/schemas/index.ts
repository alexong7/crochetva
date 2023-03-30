import category from './category'
import product from './product'
import blockContent from './blockContent'
import order from './order'
import {user, account} from 'next-auth-sanity/schemas'
import parentProduct from './parentProduct'
import aboutUs from './aboutUs'
import faq from './faq'

export const schemaTypes = [
  category,
  parentProduct,
  product,
  order,
  blockContent,
  user,
  account,
  aboutUs,
  faq,
]
