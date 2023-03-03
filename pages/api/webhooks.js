import { buffer } from "micro";
import { fetchOrder } from "@/utils/fetchOrder";

import Stripe from "stripe";

const fufillOrder = async (session) => {
  console.log("fulfilling order");

  console.log("session metadata", session.metadata);

  const order = await fetchOrder(session.metadata.orderNumber);

  // Update the Order with the matching Order ID with the success
  // fields
  const mutations = [
    {
      patch: {
        query: `*[_type == 'order' && order_number == '${session.metadata.orderNumber}']`,
        set: {
          payment_number: session.payment_intent,
          amount: session.amount_total / 100,
          images: Array.from(images),
          email: session.metadata.email,
          completedOrder: true,
        },
      },
    },
  ];

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/production`;

  await fetch(url, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_AUTH_KEY}`,
    },
    body: JSON.stringify({ mutations }),
  });

  console.log(`Order ${session.metadata.orderNumber} has been saved to the db`);
};

const decrementQuantity = async (product) => {
  // Update the Order with the matching Order ID with the success
  // fields
  const mutations = [
    {
      patch: {
        query: `*[_type == 'product' && _id == '${product["_ref"]}']`,
        dec: {
          quantity: 1,
        },
      },
    },
  ];

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/production`;

  await fetch(url, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_AUTH_KEY}`,
    },
    body: JSON.stringify({ mutations }),
  });
};

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

    let event;

    try {
      if (!sig || !endpointSecret) return;

      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (error) {
      console.log(`Webhook Error ${error.message}`);
      return res.status(400).send(`Webhook Error ${error.message}`);
    }

    if (event?.type === "checkout.session.completed") {
      const session = event?.data?.object;
      const order = await fetchOrder(session.metadata.orderNumber);

      console.log("Order", order);

      order.products.map((product) => {
        decrementQuantity(product);
      });

      // Fufill order
      return fufillOrder(session)
        .then(() => res.status(200).send)
        .catch((err) => res.status(400).send(`Webhook Error ${err.message}`));
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
