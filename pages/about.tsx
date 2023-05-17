import Header from "@/components/Header";
import { sanityClient, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { GetStaticProps } from "next";
import { groq } from "next-sanity";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  aboutUs: AboutUs[];
};

function About({ aboutUs }: Props) {
  return (
    <div className="min-h-screen overflow-hidden">
      <Head>
        <title>About Us</title>
        <link rel="icon" href="/Logo2.png" />
      </Head>

      <Header />

      <div
        className="relative mx-auto flex h-screen max-w-full flex-col items-center
    justify-center overflow-hidden text-left"
      >
        <h3 className="mt-8 text-xl uppercase tracking-[20px] underline decoration-[#FFCEEE] underline-offset-2 md:text-4xl">
          About Us
        </h3>

        <div
          className="scrollbar-track-gray-400/20 scrollbar-thumb-[#F7AB0A]/90 scrollbar-thin relative z-20 mt-6 flex w-full snap-x snap-mandatory overflow-y-hidden
        overflow-x-scroll md:mt-10"
        >
          {aboutUs.map((section) => (
            <div
              key={section._id}
              className="flex h-screen w-screen  flex-shrink-0 snap-center flex-col items-center space-y-6
                md:mt-10 md:flex-row md:items-start md:justify-center md:space-x-20"
            >
              <div className="relative h-[150px] w-[150px] md:mt-20 md:ml-24 md:h-[300px] md:w-[300px] lg:mt-14">
                <Image
                  src={urlFor(section.image).url()}
                  layout="fill"
                  objectFit="contain"
                  alt=""
                />
              </div>
              <div className=" px-0">
                <Link
                  href={
                    section.name === "Alex" ? "https://alexong.io/" : "/about"
                  }
                >
                  <h4
                    className="text-center text-2xl font-semibold tracking-[5px] underline decoration-[#FFCEEE] 
                  md:text-3xl"
                  >
                    {section.name}
                  </h4>
                </Link>

                <div className="mt-4 px-8 md:w-[400px] lg:w-[700px]">
                  <div className="text-[14px] md:text-[16px] lg:text-[17px]">
                    <PortableText value={section.description} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-[30%] left-0 h-[250px] w-full -skew-y-12 bg-[#fcf4f4]/100" />
      </div>
    </div>
  );
}

export default About;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const query = groq`
  *[_type == "about_us"]{
    ...
  }`;

  const aboutUs = await sanityClient.fetch(query);

  return {
    props: {
      aboutUs,
    },
    revalidate: 120,
  };
};
