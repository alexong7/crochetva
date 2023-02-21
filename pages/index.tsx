import Head from "next/head";
import Image from "next/image";
import Header from "@/components/Header";
import Landing from "@/components/Landing";
import { fetchCategories } from "../utils/fetchCategories";
import { GetServerSideProps } from "next";
import ProductPanel from "@/components/ProductPanel";
import { fetchProducts } from "@/utils/fetchProducts";
import { getSession } from "next-auth/react";
import Basket from "@/components/Basket";
import type { Session } from "next-auth";

interface Props {
  categories: Category[];
  products: Product[];
  session: Session | null;
}

export default function Home({ categories, products }: Props) {
  return (
    <div>
      <Head>
        <title>Crochetva PlushPals</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Basket />

      <main className="relative h-[200vh] min-h-screen">
        <Landing />
      </main>
      <section className="relative z-40 -mt-[100vh] min-h-screen bg-[#fcf4f4]">
        <ProductPanel categories={categories} products={products} />
      </section>
    </div>
  );
}

// Backend Code to Sanity
export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const categories = await fetchCategories();
  const products = await fetchProducts();
  const session = await getSession(context);

  return {
    props: {
      categories,
      products,
      session,
    },
  };
};
