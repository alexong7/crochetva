import Basket from "@/components/Basket";
import { fetchParentProducts } from "@/utils/fetchParentProducts";
import { fetchProducts } from "@/utils/fetchProducts";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

type Props = {
  products: Product[];
  parentProducts: ParentProduct[];
};

const DynamicHeader = dynamic(() => import('../../components/Header'), {
  loading: () => <p>Loading...</p>,
})

const Product = dynamic(() => import('../../components/Product'), {
  loading: () => <p>Loading...</p>,
})


function AllProducts({ products, parentProducts }: Props) {

  
  return (
    <div className="min-h-screen overflow-hidden">
      <Head>
        <title>All Products</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DynamicHeader />

      <Basket />

      <main className="flex flex-col items-center justify-center space-y-6 bg-[#fcf4f4] p-6">
        <p className="text-4xl font-medium  tracking-[4px] underline decoration-[#FFCEEE] underline-offset-2 md:text-5xl">
          All Products
        </p>
        <div className="tabPanel  ">
          {parentProducts.map((product, index) => (
            <Product key={index} product={product} childProducts={products} />
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

  return {
    props: {
      products,
      parentProducts,
    },
     // Next.js will attempt to regenerate the page:
    // - When a request comes in
    // - At most once every 10 seconds 
    // This helps with caching the data
    revalidate: 10
  };
};
