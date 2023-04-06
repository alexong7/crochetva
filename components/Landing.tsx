import React from "react";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

function Landing() {
  return (
    <section
      className="sticky top-0 mx-auto flex h-screen max-w-[1350px] items-center justify-between px-6
        "
    >
      {/* Landing Text */}
      <div className="space-y-8">
        <h1 className="space-y-3 text-5xl font-semibold tracking-wide lg:text-6xl xl:text-7xl">
          <span className="gradient block bg-clip-text text-transparent">
            Handcrafted
          </span>
          <span className="block">Pals For</span>
          <span className="block">Your Home</span>
        </h1>

        {/* Learn More */}
        <div>
          <div className="space-x-8">
            <Link href="/products/all">
              <Button title="Buy Now" />
            </Link>
            <Link href="/about" className="link">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Landing Image */}
      <div
        className="relative hidden 
      h-[450px] w-[450px] transition-all duration-500 md:inline
      lg:h-[600px] lg:w-[600px]"
      >
        <Image src="/Ava-9.jpg" alt="" layout="fill" objectFit="contain" />
      </div>
    </section>
  );
}

export default Landing;

