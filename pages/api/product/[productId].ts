import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { sanityClient } from "../../../lib/sanity";

type Data = {
  product: Product;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { productId } = req.query;

  const query = groq`
  *[_type == "product" && _id == '${productId}']{
    title,
    price,
    image,
  }[0]`;

  const product = await sanityClient.fetch(query);
  res.status(200).json({ product });
}
