// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { sanityClient } from "../../sanity";

const query = groq`
*[_type == "faq"]{
    ...
  }`;

type Data = {
  faq: FAQ[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const faq = await sanityClient.fetch(query);
  res.status(200).json({ faq });
}
