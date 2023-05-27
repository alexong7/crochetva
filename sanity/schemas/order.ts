export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'order_number',
      title: 'Order Number',
      type: 'string',
    },
    {
      name: 'payment_number',
      title: 'Stripe Payment Number',
      type: 'string',
    },
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'product'}],
        },
      ],
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'tracking_number',
      title: 'Tracking Number',
      type: 'string',
    },
    {
      name: 'order_shipped',
      title: 'Order Shipped',
      type: 'boolean',
    },
    {
      name: 'shipping_carrier',
      title: 'Shipping Carrier',
      type: 'string',
    },
    {
      name: 'completedOrder',
      title: 'Completed Order',
      type: 'boolean',
    },
    {
      name: 'stripe_checkout_session_id',
      title: 'Stripe Checkout Session ID',
      type: 'string',
    },
    {
      name: 'custom_order_details',
      title: 'Custom Order Details',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    },
  ],
}
