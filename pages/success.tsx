import Button from "@/components/Button";
import { USDollar } from "@/utils/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { fetchProducts } from "@/utils/fetchProducts";
import { urlFor } from "@/lib/sanity";
import Stripe from "stripe";
import { fetchOrder } from "@/utils/fetchOrder";
import Logo2 from "../public/Logo2.png"

interface Props {
  products: Product[];
  order: Order;
  checkoutSession: Stripe.Response<Stripe.Checkout.Session>;
}

function Success({ products, order, checkoutSession }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  useEffect(() => setMounted(true), []);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const showOrderSummaryCondition = isTabletOrMobile ? showOrderSummary : true;

  const handleShowOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary);
  };

  let filteredProducts: Product[] = [];

  order.products.map((refProduct) => {
    let foundProduct = products.find(
      (product) => product._id == refProduct._ref,
    );
    filteredProducts.push(foundProduct!);
  });


  console.log('Success - Order:', order)
  return (
    <div>
      <Head>
        <title> Thank You! - Crochetva</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mx-auto max-w-xl">
        <Link href="/">
          <div className="relative ml-4 h-24 w-16 cursor-pointer transition lg:hidden">
            <Image
              src={Logo2}
              layout="fill"
              objectFit="contain"
              alt=""
            />
          </div>
        </Link>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-9">
        <section
          className="order-2 mx-auto max-w-xl pb-12 lg:col-span-5 lg:mx-0 lg:max-w-none 
        lg:pr-16 lg:pt-16 xl:pl-16 2xl:pl-44"
        >
          <Link href="/">
            <div className="relative  ml-8 hidden h-40 w-20 cursor-pointer transition lg:inline-flex">
              <Image
                src={Logo2}
                layout="fill"
                objectFit="contain"
                alt=""
              />
            </div>
          </Link>

          <div className="my-8 ml-4 flex space-x-4 lg:ml-14 xl:ml-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black">
              <CheckIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Order #{checkoutSession?.metadata?.orderNumber || "(Refresh Page)"}
              </p>
              <h4 className="text-lg">
                Thank you{" "}
                {checkoutSession?.customer_details?.name?.split(' ')[0] || 'Guest'}
              </h4>
            </div>
          </div>

          <div className="mx-4 divide-y divide-gray-300 rounded-md border border-gray-300 p-4 lg:ml-14">
            <div className="space-y-2 pb-3">
              <p>Your order is confirmed</p>
              <p className="text-sm text-gray-600">
                We&apos;ve accepted your order, and we&apos;re getting it ready.
              </p>
            </div>
            <div className="pt-3 text-sm">
              <p className="font-medium text-gray-600">
                Order Tracking Number:
              </p>
              <p className=" text-gray-600">
                {order.tracking_number ||
                  `We're getting your order ready. Check back later for tracking details.`}
              </p>
            </div>
          </div>

          <div className="my-4 mx-4 space-y-2 rounded-md border border-gray-300 p-4 lg:ml-14">
            <p>Order updates</p>
            <p className="text-sm text-gray-600">
              You&apos;ll get shipping and delivery updates by email.
            </p>
          </div>

          <div className="mx-4 flex flex-col items-center justify-between text-sm lg:ml-14 lg:flex-row">
            <p className="hidden lg:inline">Need help? Contact us</p>
            {mounted && (
              <Button
                title="Continue Shopping"
                onClick={() => router.push("/")}
                width={isTabletOrMobile ? "w-full" : undefined}
                padding="py-4"
              />
            )}
          </div>
        </section>

        {mounted && (
          <section
            className="overflow-y-scroll border-y border-l 
          border-gray-300 bg-[#FAFAFA] lg:order-2 lg:col-span-4 lg:h-screen lg:border-y-0"
          >
            <div
              className={`w-full ${
                showOrderSummaryCondition && "border-b"
              } border-gray-300 text-sm lg:hidden`}
            >
              <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-6">
                <button
                  onClick={handleShowOrderSummary}
                  className="flex items-center space-x-2"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <p>Show order summary</p>
                  {showOrderSummaryCondition ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>

                <p className="text-xl font-medium text-black">
                  {USDollar.format(checkoutSession?.amount_total! / 100)}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            {showOrderSummaryCondition && (
              <div className="mx-auto max-w-xl divide-y border-gray-300 px-4 py-4 lg:mx-0 lg:max-w-lg lg:px-10 lg:py-16">
                <div className="space-y-4 pb-4">
                  {filteredProducts.map((product, index) => (
                    // Main row container
                    <div
                      key={index}
                      className="flex items-center space-x-4 text-sm font-medium"
                    >
                      {/* Image Box + Quantity */}
                      <div className="relative flex h-16 w-16 items-center justify-center text-xs text-white">
                        <div className="fit h-16 w-16  rounded-md">
                          <Image
                            src={urlFor(product.image[0]).url()}
                            layout="fill"
                            objectFit="contain"
                            alt=""
                          />
                        </div>
                      </div>

                      {/*  Item Title & Price */}
                      <p className="flex-1">{product.title}</p>
                      <p>{USDollar.format(product.price)}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-1 py-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <p className="text-[gray]">Subtotal</p>
                    <p className="font-medium">
                      {USDollar.format(checkoutSession?.amount_subtotal! / 100)}
                    </p>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <p className="text-[gray]">Shipping</p>
                    <p className="font-medium">
                      {USDollar.format(
                        checkoutSession?.shipping_cost?.amount_subtotal! / 100,
                      )}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between pt-4">
                  <p>Total</p>
                  <p className="flex items-center gap-x-4 text-xs text-[gray]">
                    USD
                    <span className="text-xl font-medium text-black">
                      {USDollar.format(checkoutSession?.amount_total! / 100)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Success;

const defaultImage =
  "https://i.pinimg.com/originals/d7/14/54/d714540f9b3fc4127d14f00e3a084e36.png";

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const sessionId = query.session_id as string;
  const products = await fetchProducts();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2022-11-15",
  });

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    sessionId?.toString()!,
  );
  console.log("checkout session", checkoutSession);

  const orderNumber = checkoutSession.metadata?.orderNumber;

  const order = await fetchOrder(orderNumber!);


  return {
    props: {
      products,
      order,
      checkoutSession,
    },
  };
};
