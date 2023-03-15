// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { urlFor } from "../../sanity";
import { sanityClient } from "../../sanity";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const items: Product[] = req.body.items;

    // This is the shape in which stripe expects the data to be
    const transformedItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [urlFor(item.image[0]).url()],
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }));

    const orderid = require("order-id")();
    let orderId = orderid.generate();

    const getMetadata = (items: Product[]) => {
      let metadata: { [key: string]: string } = {};

      items.map((item) => {
        metadata[item._id] = urlFor(item.image[0]).url();
      });

      metadata.email = req.body.email;

      metadata.orderNumber = orderId;

      console.log(metadata.orderNumber);
      return metadata;
    };

    const createOrder = async () => {
      let products: { _key: string; _ref: string; _type: string }[] = [];

      items.map((item, index) => {
        let referenceObject = {
          _key: index.toString(),
          _ref: item._id,
          _type: "reference",
        };

        products.push(referenceObject);
      });

      // New Document to be posted to the Orders Collection
      const mutations = [
        {
          create: {
            _type: "order",
            order_number: orderId.toString(),
            products: products,
            completedOrder: false,
          },
        },
      ];

      const newDoc = {
        _type: "order",
        order_number: orderId.toString(),
        products: products,
        completedOrder: false,
      };

      const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/production`;

      sanityClient
        .create(newDoc)
        .then(() => {
          console.log("document created");
        })
        .catch(console.error);

      // const response = await fetch(url, {
      //   method: "post",
      //   headers: {
      //     "Content-type": "application/json",
      //     Authorization: `Bearer ${process.env.SANITY_AUTH_KEY}`,
      //   },
      //   body: JSON.stringify({ mutations }),
      // });

      // console.log("Create Order Response", response);
    };

    try {
      // Create Checkout Sessions from body params
      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        line_items: transformedItems,
        payment_intent_data: {},
        mode: "payment",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout`,
        metadata: getMetadata(items),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 799, currency: "usd" },
              display_name: "Standard Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ],
      };
      createOrder();
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
