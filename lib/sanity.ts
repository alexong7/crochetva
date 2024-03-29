// lib/sanity.server.js
import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

// lib/config.js
export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN!,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  apiVersion: "2023-04-01", // Learn more: https://www.sanity.io/docs/api-versioning
  useCdn: process.env.NODE_ENV === "production",
};

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

export const urlFor = (source: any) =>
  createImageUrlBuilder(config).image(source);
