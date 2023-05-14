export default {
  name: 'parentProduct',
  title: 'Parent Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
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
      name: 'childProduct',
      title: 'Main Child Product',
      type: 'reference',
      to: [{type: 'product'}],
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },

    {
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    },
    {
      name: 'customColorHeader1',
      title: 'Custom Color Header 1',
      type: 'reference',
      to: [{type: 'customColorLabel'}],
    },
    {
      name: 'customColors1',
      title: 'Custom Colors 1',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'color'}]
        }
      ]
    },
    {
      name: 'customColorHeader2',
      title: 'Custom Color Header 2',
      type: 'reference',
      to: [{type: 'customColorLabel'}],
    },
    {
      name: 'customColors2',
      title: 'Custom Colors 2',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'color'}]
        }
      ]
    },
    {
      name: 'customColorHeader3',
      title: 'Custom Color Header 3',
      type: 'reference',
      to: [{type: 'customColorLabel'}],
    },
    {
      name: 'customColors3',
      title: 'Custom Colors 3',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'color'}]
        }
      ]
    },
  ],
}
