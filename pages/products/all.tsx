import Basket from "@/components/Basket";
import { DISABLE_INVENTORY_FLAG } from "@/constants/flags";
import { sanityClient } from "@/lib/sanity";
import { fetchFlags } from "@/utils/fetchFlags";
import { fetchParentProducts } from "@/utils/fetchParentProducts";
import { fetchProducts } from "@/utils/fetchProducts";
import { queryFlags } from "@/utils/queries";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

type Props = {
  products: Product[];
  parentProducts: ParentProduct[];
  flags: Flag[];
};

const DynamicHeader = dynamic(() => import("../../components/Header"), {
  loading: () => <p>Loading...</p>,
});

const Product = dynamic(() => import("../../components/Product"), {
  loading: () => <p>Loading...</p>,
});

function AllProducts({ products, parentProducts, flags }: Props) {
  /// Flags
  const inventoryDisabledFlag = flags?.find(
    (flag) => flag.name === DISABLE_INVENTORY_FLAG,
  );

  const inventoryEnabled = !inventoryDisabledFlag?.enabled ?? true;

  return (
    <div className="min-h-screen overflow-hidden">
      <Head>
        <title>All Products</title>
        <link rel="icon" href="/Logo2.png" />
      </Head>

      <DynamicHeader />

      <Basket />

      <main className="flex flex-col items-center justify-center space-y-6 bg-[#fcf4f4] p-6">
        <p className="text-4xl font-medium  tracking-[4px] underline decoration-[#FFCEEE] underline-offset-2 md:text-5xl">
          All Products
        </p>
        <div className="tabPanel">
          {parentProducts.map((product, index) => (
            <Product
              key={index}
              product={product}
              childProducts={products}
              inventoryEnabled={inventoryEnabled}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default AllProducts;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const products = await fetchProducts();
  const parentProducts = await fetchParentProducts();
  const flags = await sanityClient.fetch(queryFlags);

  return {
    props: {
      products,
      parentProducts,
      flags,
    },
    // Next.js will attempt to regenerate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    // This helps with caching the data
    revalidate: 10,
  };
};
