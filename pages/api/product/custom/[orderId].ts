import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { sanityClient } from "../../../../lib/sanity";

type Data = {
  customProducts: CustomOrderProduct[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { orderId } = req.query;

  const query = groq`
  *[_type == "customOrderProduct" && order_number == '${orderId}']{
    ...
    }
 `;

  const customProducts = await sanityClient.fetch(query);
  res.status(200).json({ customProducts });
}
