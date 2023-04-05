// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { groq } from "next-sanity";
import { sanityClient } from "../../lib/sanity"

const query = groq`
*[_type == "about_us"]{
    ...
  }`;

type Data = {
  aboutUs: AboutUs[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const aboutUs = await sanityClient.fetch(query)
  res.status(200).json({aboutUs})
}
