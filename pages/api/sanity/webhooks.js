import { urlFor } from "@/lib/sanity";
import Stripe from "stripe";

import { fetchProductById } from "@/utils/fetchProductById";
import { sendOrderConfirmation } from "@/utils/sendOrderConfirmation";
import { fetchCustomProducts } from "@/utils/fetchCustomProducts";

// Sends an email order confirmation to the customer and to our
// internal email so we are notified of a new order
const orderShippedConfirmation = async (session, order, trackingNumber) => {
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
  data.trackingNumber = trackingNumber;

  // Send to order shipped confirmation to customer
  await sendOrderShippedConfirmation(data);
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const rawBody = await buffer(req);

    const stripeCheckoutSessionId = rawBody.stripe_checkout_session_id;
    const trackingNumber = rawBody.tracking_number;
    const order = await fetchOrder(rawBody.order_number);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });

    const checkoutSession = await stripe.checkout.sessions.retrieve(
      stripeCheckoutSessionId?.toString(),
    );

    await orderShippedConfirmation(checkoutSession, order, trackingNumber)
      .then(() => res.status(200).end())
      .catch((err) =>
        res.status(400).send(`Order Shipped Confirmation Error ${err.message}`),
      );
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
