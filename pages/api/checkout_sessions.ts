// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { queryShipping } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { urlFor } from "../../lib/sanity";
import { sanityClient } from "../../lib/sanity";
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

      metadata.email = req.body.email;

      metadata.orderNumber = orderId;

      console.log(metadata.orderNumber);
      return metadata;
    };

    const createNewCustomProduct = async (item: Product) => {
      let baseProduct = {
        _ref: item.parentProduct._ref,
        _type: "reference",
      };

      let customColorHeader1,
        customColorHeader2,
        customColorHeader3 = "";
      let customColor1,
        customColor2,
        customColor3 = "";
      let index = 0;
      Object.keys(item.customProperties).map((key) => {
        switch (index) {
          case 0:
            customColorHeader1 = key;
            customColor1 = item.customProperties[key];
            break;

          case 1:
            customColorHeader2 = key;
            customColor2 = item.customProperties[key];
            break;
          case 2:
            customColorHeader3 = key;
            customColor3 = item.customProperties[key];
            break;
        }
        index++;
      });

      const newCustomProduct = {
        _type: "customOrderProduct",
        order_number: orderId.toString(),
        image: item.image[0],
        base_product: baseProduct,
        title: item.title,
        price: item.price,
        customColorHeader1: customColorHeader1,
        customColor1: customColor1,
        customColorHeader2: customColorHeader2,
        customColor2: customColor2,
        customColorHeader3: customColorHeader3,
        customColor3: customColor3,
      };

      sanityClient
        .create(newCustomProduct)
        .then(() => {
          console.log("New Custom Product Created");
        })
        .catch(console.error);
    };

    const createOrder = async () => {
      let products: { _key: string; _ref: string; _type: string }[] = [];
      let customOrderDetails: string[] = [];

      items.map((item, index) => {
        if (item.isCustom) {
          let details = `${item.title}:  `;
          Object.keys(item.customProperties).map(
            (key) => (details += `${key}:${item.customProperties[key]} --- `),
          );

          customOrderDetails.push(details);
        }

        let referenceObject = {
          _key: index.toString(),
          _ref: item._id,
          _type: "reference",
        };

        products.push(referenceObject);
      });

      const newOrder = {
        _type: "order",
        order_number: orderId.toString(),
        products: products,
        custom_order_details: customOrderDetails,
        completedOrder: false,
      };

      await sanityClient
        .create(newOrder)
        .then(() => {
          console.log("New Order Created");
        })
        .catch(console.error);

      await Promise.all(
        items.map(async (item) => {
          if (item.isCustom) {
            await createNewCustomProduct(item);
          }
        }),
      );
    };

    try {
      const shipping: Shipping = await sanityClient.fetch(queryShipping);

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
              fixed_amount: {
                amount: (shipping?.shipping_rate ?? 7.99) * 100,
                currency: "usd",
              },
              display_name: "Standard Shipping",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: shipping?.min_days ?? 7,
                },
                maximum: {
                  unit: "business_day",
                  value: shipping?.max_days ?? 10,
                },
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
