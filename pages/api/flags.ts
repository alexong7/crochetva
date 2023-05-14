// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { queryFlags } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../lib/sanity";

type Data = {
  flags: Flag[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const flags = await sanityClient.fetch(queryFlags);
  res.status(200).json({ flags });
}
