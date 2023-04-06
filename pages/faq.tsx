import Header from "@/components/Header";
import { sanityClient } from "@/lib/sanity";
import {  GetStaticProps } from "next";
import { groq } from "next-sanity";
import Head from "next/head";

import React from "react";

type Props = {
  faq: FAQ[];
};

function Faq({ faq }: Props) {
  return (
    <div>
      <Head>
        <title>FAQ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="h-[110vh]">
        <div className="flex flex-col items-center justify-center">
          <h1 className="relative ml-[12px] mt-8 text-4xl uppercase tracking-[10px] underline decoration-[#FFCEEE] underline-offset-8 md:ml-0 md:text-4xl  ">
            FAQ
          </h1>
          {faq.map((section) => {
            return (
              <div key={section._id} className="sm:w-1/2">
                <div className="ml-4 mr-auto mt-10 pl-2 pr-6">
                  <h2 className="text-3xl font-semibold">{section.question}</h2>
                  <p className="mt-2 text-sm">{section.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Faq;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const query = groq`
  *[_type == "faq"]{
      ...
    }`;
  

    const faq = await sanityClient.fetch(query);
  

  return {
    props: {
      faq,
    },
     // Next.js will attempt to regenerate the page:
    // - When a request comes in
    // - At most once every hour 
    // This helps with caching the data
    revalidate: 3600,
  };
};
