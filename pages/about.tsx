import Header from "@/components/Header";
import Head from "next/head";
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

      <main>
        <div>About Us</div>
      </main>
    </div>
  );
}

export default About;
