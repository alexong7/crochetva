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
    customColorHeader1,
    customColors1,
    customColorHeader2,
    customColors2,  
    customColorHeader3,
    customColors3,
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
    isCustom,
  }`;

export const queryColors = groq`
  *[_type == "color"]{
    _id,
    hex,
    name
  }`;

export const queryCustomColorLabels = groq`
*[_type == "customColorLabel"]{
  _id,
  name
}`;

export const queryFlags = groq`
*[_type == "flag"]{
    _id,
    name,
    enabled
  }`;
