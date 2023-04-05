import { buffer } from "micro";
import { fetchOrder } from "@/utils/fetchOrder";
import { sanityClient } from "../../lib/sanity";
import { urlFor } from "@/lib/sanity";
import getRawBody from "raw-body";

import Stripe from "stripe";
import { fetchProductById } from "@/utils/fetchProductById";
import { sendOrderConfirmation } from "@/utils/sendOrderConfirmation";

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
      email: session.customer_details.email,
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

// Sends an email order confirmation to the customer
const orderConfirmation = async (session, order) => {
  const data = {};

  const email = session.customer_details.email;
  const orderNumber = session.metadata.orderNumber;
  const subTotal = session.amount_subtotal;
  const total = session.amount_total;
  const shipping = session.shipping_cost.amount_total;
  const tax = session.total_details.amount_tax;

  const address = session.customer_details.address;
  const custName = session.customer_details.name;

  const products = [];

  console.log(order.products);

  await Promise.all(
    order.products.map(async (p) => {
      const product = await fetchProductById(p._ref);
      products.push({
        title: product.title,
        image: urlFor(product.image[0]).url(),
        price: product.price,
      });
    }),
  );

  data.email = email;
  data.orderNumber = orderNumber;
  data.products = products;
  data.subTotal = subTotal;
  data.total = total;
  data.tax = tax;
  data.shippingCost = shipping;
  data.address = address;
  data.custName = custName;

  await sendOrderConfirmation(data);
};

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method === "POST") {
    console.log('inside post webhook');
    console.log(process.env.STRIPE_SIGNING_SECRET);
    const rawBody = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

    let event;

    try {
      if (!sig || !endpointSecret) return;

      event = stripe.webhooks.constructEvent(rawBody.toString(), sig, endpointSecret);
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
      await fufillOrder(session, order).catch((err) =>
        res.status(400).send(`Webhook Error ${err.message}`),
      );

      // Send Order Confirmation if order fufills
      await orderConfirmation(session, order)
        .then(() => res.status(200))
        .catch((err) =>
          res.status(400).send(`Order Confirmation Error ${err.message}`),
        );
    }
  }

  return res.status(200);
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
