export default {
  name: 'customOrderProduct',
  title: 'Custom Order Product',
  type: 'document',
  fields: [
    {
      name: 'order_number',
      title: 'Order Number',
      type: 'string',
    },

    {
      name: 'base_product',
      title: 'Base Product',
      type: 'reference',
      to: [{type: 'parentProduct'}],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'customColorHeader1',
      title: 'Custom Color Header 1',
      type: 'string',
    },
    {
      name: 'customColor1',
      title: 'Custom Colors 1',
      type: 'string',
    },
    {
      name: 'customColorHeader2',
      title: 'Custom Color Header 2',
      type: 'string',
    },
    {
      name: 'customColor2',
      title: 'Custom Colors 2',
      type: 'string',
    },
    {
      name: 'customColorHeader3',
      title: 'Custom Color Header 3',
      type: 'string',
    },
    {
      name: 'customColor3',
      title: 'Custom Colors 3',
      type: 'string',
    },
  ],
}
