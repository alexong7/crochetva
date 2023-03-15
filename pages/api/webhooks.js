import { buffer } from "micro";
import { fetchOrder } from "@/utils/fetchOrder";
import { sanityClient } from "../../sanity";

import Stripe from "stripe";

const fufillOrder = async (session, order) => {
  console.log("fulfilling order");

  console.log("session metadata", session.metadata);

  const docId = order._id;
  console.log("fufillOrder docId", docId);

  // Perform an Update based on the docID for the given Order
  sanityClient
    .patch(docId)
    .set({
      payment_number: session.payment_intent,
      amount: session.amount_total / 100,
      email: session.metadata.email,
      completedOrder: true,
    })
    .commit()
    .then((updatedOrder) => {
      console.log("Order sucessfully fufilled!");
    })
    .catch((err) => {
      console.error("Oh no, the update failed: ", err.message);
    });
};

const decrementQuantity = async (product) => {
  console.log("Decrementing Product Quantity");

  const productId = product._ref;
  console.log("productID", productId);

  // Perform a patch to decrement the product quantity by 1
  sanityClient
    .patch(productId)
    .dec({
      quantity: 1,
    })
    .commit()
    .then((updatedOrder) => {
      console.log("Decremented product!");
    })
    .catch((err) => {
      console.error("Oh no, the decrement update failed: ", err.message);
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

      await Promise.all(
        order.products.map(async (product) => {
          await decrementQuantity(product);
        }),
      );

      // Fufill order
      await fufillOrder(session, order)
        .then(() => res.status(200).send)
        .catch((err) => res.status(400).send(`Webhook Error ${err.message}`));

      return;
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
