// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { groq } from "next-sanity";
import { sanityClient } from "../../sanity"

const query = groq`
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

type Data = {
  parentProducts: ParentProduct[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const parentProducts = await sanityClient.fetch(query)
  res.status(200).json({parentProducts})
}
