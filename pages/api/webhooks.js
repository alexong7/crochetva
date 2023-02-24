// const saveTitle = async (title) => {
//   const mutations = [
//     {
//       create: {
//         _id: "123",
//         _type: "article",
//         title: title,
//       },
//     },
//   ];

//   const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/production`;

//   const response = await fetch(url, {
//     method: "post",
//     headers: {
//       "Content-type": "application/json",
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
//     },
//     body: JSON.stringify({ mutations }),
//   });
//   const result = await response.json();
// };

import { buffer } from "micro";
import Stripe from "stripe";

const fufillOrder = async (session) => {
  console.log("fulfilling order");

  let images = new Set();

  for (const [key, value] of Object.entries(session.metadata)) {
    console.log(`${key}: ${value}`);
    if (key.includes("image")) {
      images.add(value);
    }
  }

  console.log("images", images);

  // New Document to be posted to the Orders Collection
  const mutations = [
    {
      create: {
        _id: session.id,
        _type: "order",
        payment_number: session.payment_intent,
        amount: session.amount_total / 100,
        images: Array.from(images),
        email: session.metadata.email,
      },
    },
  ];

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/production`;

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_AUTH_KEY}`,
    },
    body: JSON.stringify({ mutations }),
  });
  const result = await response.json();

  console.log(`Order ${session.id} has been saved to the db`);
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
      console.log("event", event);

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
