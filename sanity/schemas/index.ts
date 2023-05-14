import category from './category'
import product from './product'
import blockContent from './blockContent'
import order from './order'
import {user, account} from 'next-auth-sanity/schemas'
import parentProduct from './parentProduct'
import aboutUs from './aboutUs'
import faq from './faq'
import color from './color'
import customColorLabel from './customColorLabel'
import customOrderProduct from './customOrderProduct'
import flags from './flags'

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
  color,
  customColorLabel,
  customOrderProduct,
  flags,
]
