import Button from "@/components/Button";
import { selectBasketItems, selectBasketTotal } from "@/redux/basketSlice";
import getStripe from "@/utils/get-stripejs";
import { fetchPostJSON, USDollar } from "@/utils/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Stripe } from "stripe";
import { GetStaticProps } from "next";
import { fetchParentProducts } from "@/utils/fetchParentProducts";
import dynamic from "next/dynamic";

type Props = {
  parentProducts: ParentProduct[];
};

function Checkout({ parentProducts }: Props) {
  const items = useSelector(selectBasketItems);
  const basketTotal = useSelector(selectBasketTotal);
  const router = useRouter();

  const DynamicCheckoutProduct = dynamic(() => import('../components/CheckoutProduct'), {
    loading: () => <p>Loading...</p>,
  })

  const DynamicHeader = dynamic(() => import('../components/Header'), {
    loading: () => <p>Loading...</p>,
  })

  // States
  // ------
  // Map { string : product array }
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState(
    {} as { [key: string]: Product[] },
  );
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async () => {
    setLoading(true);

    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      "/api/checkout_sessions",
      {
        items: items,
      },
    );

    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);

    setLoading(false);
  };

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item._id] = results[item._id] || []).push(item);
      return results;
    }, {} as { [key: string]: Product[] });

    setGroupedItemsInBasket(groupedItems);
  }, [items]);

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <Head>
        <title>Bag - Crochetva</title>
        <link rel="icon" href="/Logo2.png" />
      </Head>
      <DynamicHeader />

      <main className="mx-auto max-w-5xl pb-24">
        <div className="px-5">
          <h1 className="my-4 text-3xl font-semibold lg:text-4xl">
            {items.length > 0 ? "Review your bag." : "Your bag is empty."}
          </h1>

          {items.length === 0 && (
            <Button
              title="Continue Shopping"
              onClick={() => router.push("/")}
            />
          )}
        </div>

        {items.length > 0 && (
          <div className="mx-6 md:mx-8">
            {Object.entries(groupedItemsInBasket).map(([key, items]) => (
              <DynamicCheckoutProduct
                key={key}
                items={items}
                id={key}
                parentProducts={parentProducts}
              />
            ))}

            {/* Main Total Div */}
            <div className="my-12 mt-6 ml-auto max-w-3xl">
              <div className="divide-y divide-gray-300">
                {/* Subtotal + Additional costs  */}
                <div className="pb-4">
                  {/* Subtotal row */}
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{USDollar.format(basketTotal)}</p>
                  </div>

                  {/* Shipping row */}
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p className="text-sm text-gray-500">
                      {" "}
                      Calculated at next step
                    </p>
                  </div>

                  {/* Estimated Tax row
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-x-1 lg:flex-row">
                      Estimated tax:
                    </div>
                    <p className="text-sm text-gray-500">
                      Calculated at next step
                    </p>
                  </div> */}
                </div>

                {/* Divided, Total Section */}
                <div className="flex justify-between pt-4 text-xl font-semibold">
                  <h4>Total</h4>
                  <h4>{USDollar.format(basketTotal)}</h4>
                </div>
              </div>

              <div className="my-6 space-y-4">
                <Button
                  noIcon
                  loading={loading}
                  title="Check Out"
                  width="w-full"
                  onClick={createCheckoutSession}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const parentProducts = await fetchParentProducts();

  return {
    props: {
      parentProducts,
    },
    revalidate: 5,
  };
};
