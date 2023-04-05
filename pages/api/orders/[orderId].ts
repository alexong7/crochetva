// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { useRouter } from "next/router";
import { sanityClient } from "../../../lib/sanity";

type Data = {
  order: Order;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { orderId } = req.query;

  const query = groq`
  *[_type == 'order' && order_number == '${orderId}']{
      ...
    }[0]`;

  const order = await sanityClient.fetch(query);
  res.status(200).json({ order });
}
