import Header from "@/components/Header";
import { fetchProducts } from "@/utils/fetchProducts";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import React from "react";

interface Props {
  products: Product[];
}

function ProductScreen({ products }: Props) {
  const { query } = useRouter();
  const { slug } = query;

  const product = products.find((product) => product.slug.current === slug);

  return (
    <div>
      <Head>
        <title>{product?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>{product?.title}</main>
    </div>
  );
}

export default ProductScreen;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const products = await fetchProducts();

  return {
    props: {
      products,
    },
  };
};
