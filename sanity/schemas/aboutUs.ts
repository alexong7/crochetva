export default {
    name: "about_us",
    title: "About Us",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        options: {
          hotspot: true,
        },
      },
      {
        name: "description",
        title: "Description",
        type: "blockContent",
      },
    ],
  };