import { urlFor } from "@/sanity";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

type Props = {
  product: Product;
};

function Product({ product }: Props) {
  return (
    <div
      className="flex h-fit w-[320px] select-none flex-col space-y-3 rounded-xl 
    bg-[#ffffff] p-8 md:h-[500px] md:w-[400px] md:p-10"
    >
      <div className="relative h-64 w-full md:h-72">
        <Image
          src={urlFor(product.image[0]).url()}
          alt=""
          layout="fill"
          objectFit="contain"
        />
      </div>

      <div className="flex flex-1 items-center justify-between space-x-3">
        <div className="space-y-2 text-xl text-black md:text-2xl">
          <p>{product.title}</p>
          <p>${product.price}</p>
        </div>

        <div
          className="gradient flex h-12 w-12 flex-shrink-0 cursor-pointer
        items-center justify-center rounded-full md:h-[70px] md:w-[70px]"
        >
          <ShoppingCartIcon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default Product;