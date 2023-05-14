import { buffer } from "micro";
import { fetchOrder } from "@/utils/fetchOrder";
import { sanityClient } from "../../lib/sanity";
import { urlFor } from "@/lib/sanity";

import Stripe from "stripe";
import { fetchProductById } from "@/utils/fetchProductById";
import { sendOrderConfirmation } from "@/utils/sendOrderConfirmation";
import { fetchCustomProducts } from "@/utils/fetchCustomProducts";

const fufillOrder = async (session, order) => {
  console.log("fulfilling order");

  const docId = order._id;

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

// Sends an email order confirmation to the customer and to our
// internal email so we are notified of a new order
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
  const customProducts = [];

  // Add all non custom products
  await Promise.all(
    order.products.map(async (p) => {
      const product = await fetchProductById(p._ref);
      if (
        !product.isCustom ||
        !product.title.toLowerCase().includes("custom")
      ) {
        products.push({
          title: product.title,
          image: urlFor(product.image[0]).url(),
          price: product.price,
        });
      }
    }),
  );

  // Fetch the custom products that may be
  // associated with this order
  const fetchedCustomProducts = await fetchCustomProducts(orderNumber);

  fetchedCustomProducts.map((product) => {
    customProducts.push({
      title: product.title,
      image: urlFor(product.image).url(),
      price: product.price,
      customColorHeader1: product.customColorHeader1,
      customColor1: product.customColor1,
      customColorHeader2: product.customColorHeader2,
      customColor2: product.customColor2,
      customColorHeader3: product.customColorHeader3,
      customColor3: product.customColor3,
    });
  });

  data.email = email;
  data.orderNumber = orderNumber;
  data.products = products;
  data.customProducts = customProducts;
  data.subTotal = subTotal;
  data.total = total;
  data.tax = tax;
  data.shippingCost = shipping;
  data.address = address;
  data.custName = custName;

  // Send to customer
  data.internal = false;
  await sendOrderConfirmation(data);

  // Send to internal email
  data.internal = true;
  await sendOrderConfirmation(data);
};

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method === "POST") {
    const rawBody = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

    let event;

    try {
      if (!sig || !endpointSecret) return;

      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        sig,
        endpointSecret,
      );
    } catch (error) {
      console.log(`Webhook Error ${error.message}`);
      return res.status(400).send(`Webhook Error ${error.message}`);
    }

    if (event?.type === "checkout.session.completed") {
      const session = event?.data?.object;
      const order = await fetchOrder(session.metadata.orderNumber);

      await Promise.all(
        order.products.map(async (product) => {
          await decrementQuantity(product);
        }),
      );

      // Fufill order
      await fufillOrder(session, order).catch((err) =>
        res.status(400).send(`Webhook Error ${err.message}`),
      );

      // Send order confirmation to customer and to
      // our internal email
      await orderConfirmation(session, order)
        .then(() => res.status(200).end())
        .catch((err) =>
          res.status(400).send(`Order Confirmation Error ${err.message}`),
        );
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
