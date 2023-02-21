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
        name: "amount",
        title: "Amount",
        type: "number",
      },
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "image" }],
        options: {
          hotspot: true,
        },
      },
      {
        name: "email",
        title: "Email",
        type: "string",
      },
    ],
  };