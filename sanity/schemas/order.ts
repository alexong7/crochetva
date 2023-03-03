export default {
    name: "order",
    title: "Order",
    type: "document",
    fields: [
      {
        name: "order_number",
        title: "Order Number",
        type: "string",
      },
      {
            name: "payment_number",
            title: "Stripe Payment Number",
            type: "string",
      },
      {
        name: "amount",
        title: "Amount",
        type: "number",
      },
      {
        name: "products",
        title: "Products",
        type: "array",
        of: [
        { 
          type: "reference" ,
          to: [
            {type: 'product'},
          ]
        }
    ],
      },
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "string" }],
      },
      {
        name: "email",
        title: "Email",
        type: "string",
      },
      {
        name: "completedOrder",
        title: "Completed Order",
        type: "boolean",
      },
    ],
  };