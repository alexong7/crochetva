export default {
    name: "parentProduct",
    title: "Parent Product",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "title",
          maxLength: 96,
        },
      },
      {
        name: "image",
        title: "Image",
        type: "array",
        of: [{ type: "image" }],
        options: {
          hotspot: true,
        },
      },
      {
        name: "category",
        title: "Category",
        type: "reference",
        to: [{ type: "category" }],
      },
      {
        name: "childProduct",
        title: "Main Child Product",
        type: "reference",
        to: [{ type: "product" }],
      },
      {
        name: "price",
        title: "Price",
        type: "number",
      },
      {
        name: "quantity",
        title: "Quantity",
        type: "number",
      },
      {
        name: "description",
        title: "Description",
        type: "blockContent",
      },
    ],
  };