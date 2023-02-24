export default {
    name: "order",
    title: "Order",
    type: "document",
    fields: [
        {
            name: "payment_number",
            title: "Payment Number",
            type: "string",
          },
      {
        name: "amount",
        title: "Amount",
        type: "number",
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
    ],
  };