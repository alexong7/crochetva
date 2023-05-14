export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'parentProduct',
      title: 'Parent Product',
      type: 'reference',
      to: [{type: 'parentProduct'}],
    },
    {
      name: 'colorName',
      title: 'Color Name',
      type: 'string',
    },
    {
      name: 'colorHex',
      title: 'Color Hex',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        hotspot: true,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
    },
    {
      name: 'isCustom',
      title: 'Is Custom',
      type: 'boolean',
    },
  ],
}
