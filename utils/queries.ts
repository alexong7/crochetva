import { groq } from "next-sanity";

export const queryParentProducts = groq`
*[_type == "parentProduct"]{
    _id,
    category,
    image,
    price,
    slug,
    title,
    quantity,
    childProduct,
    description,
  }`;


 export const queryProducts = groq`
*[_type == "product"]{
    _id,
    category,
    image,
    colorName,
    colorHex,
    parentProduct,
    price,
    slug,
    title,
    quantity,
  }`;