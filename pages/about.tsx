import Header from "@/components/Header";
import { urlFor } from "@/sanity";
import Head from "next/head";
import Image from "next/image";
import React from "react";

type Props = {};

function About({}: Props) {
  return (
    <div className="min-h-screen overflow-hidden">
      <Head>
        <title>About Us</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* <main>
        <div>About Us</div>
      </main> */}

      <div
        className="relative mx-auto flex h-screen max-w-full flex-col items-center
    justify-center overflow-hidden text-left"
      >
        <h3 className="mt-8 text-xl uppercase tracking-[20px] md:text-4xl ">
          About Us
        </h3>

        <div
          className="scrollbar-track-gray-400/20 scrollbar-thumb-[#F7AB0A]/90 scrollbar-thin relative z-20 mt-6 flex w-full snap-x snap-mandatory overflow-y-hidden
        overflow-x-scroll md:mt-10"
        >
          <div
            className="flex h-screen  w-full snap-center flex-col items-center space-y-6
         md:mt-10 md:flex-row md:items-start md:justify-center md:space-x-20"
          >
            <div className="relative h-[100px] w-[100px] flex-shrink-0 md:mt-20 md:ml-24 md:h-[300px] md:w-[300px] lg:mt-14">
              <Image src={CY_PNG} layout="fill" objectFit="contain" alt="" />
            </div>
            <div className=" px-0">
              <h4
                className="text-center text-2xl font-semibold tracking-[5px] underline decoration-[#FFCEEE] 
              md:text-3xl"
              >
                Ava
              </h4>

              <div className="mt-4 px-8 md:w-[400px] lg:w-[700px]">
                <p className="text-[14px] md:text-[16px] lg:text-[17px]">
                  {blockText}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[30%] left-0 h-[250px] w-full -skew-y-12 bg-[#fcf4f4]/100" />
      </div>
    </div>
  );
}

export default About;

const CY_PNG =
  "https://www.clipartmax.com/png/full/189-1890830_red-bird-clip-art.png";

const blockText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
