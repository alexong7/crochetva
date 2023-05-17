interface Category {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "category";
  slug: {
    _type: "slug";
    current: string;
  };
  title: string;
}

interface AboutUs {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "about_us";
  name: string;
  image: Image;
  description;
}

interface FAQ {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "faq";
  question: string;
  answer: string;
}

interface Product {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "product";
  slug: {
    _type: "slug";
    current: string;
  };
  parentProduct: {
    _type: "reference";
    _ref: string;
  };
  customProperties: { [key: string]: string };
  title: string;
  colorName: string;
  colorHex: string;
  productFamily: string;
  image: Image[];
  category: {
    _type: "reference";
    _ref: string;
  };
  price: number;
  quantity: number;
  isCustom: boolean;
}

interface ParentProduct {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "parentProduct";
  slug: {
    _type: "slug";
    current: string;
  };
  title: string;
  image: Image[];
  category: {
    _type: "reference";
    _ref: string;
  };
  childProduct: {
    _type: "reference";
    _ref: string;
  };
  price: number;
  description;
  customColorHeader1: {
    _type: "reference";
    _ref: string;
  };
  customColors1: [
    {
      _type: "reference";
      _ref: string;
    },
  ];
  customColorHeader2: {
    _type: "reference";
    _ref: string;
  };
  customColors2: [
    {
      _type: "reference";
      _ref: string;
    },
  ];
  customColorHeader3: {
    _type: "reference";
    _ref: string;
  };
  customColors3: [
    {
      _type: "reference";
      _ref: string;
    },
  ];
}

interface CustomOrderProduct {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "customOrderProduct";
  order_number: string;
  title: string;
  price: number;
  image: Image;
  base_product: {
    _type: "reference";
    _ref: string;
  };
  customColorHeader1: string;
  customColor1: string;
  customColorHeader2: string;
  customColor2: string;
  customColorHeader3: string;
  customColor3: string;
}

interface StripeProduct {
  id: string;
  amount_discount: number;
  amount_subtotal: number;
  amount_tax: number;
  currency: string;
  description: string;
  object: string;
  quantity: number;
  price: {
    unit_amount: number;
  };
}

interface Order {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "order";
  completedOrder: boolean;
  order_number: string;
  amount: number;
  shipping_carrier: string;
  tracking_number: string;
  products: [
    {
      _type: "reference";
      _ref: string;
    },
  ];
}

interface Color {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "color";
  hex: string;
  name: string;
}

interface CustomColorLabel {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "customColorLabel";
  name: string;
}

interface Flag {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "flag";
  name: string;
  enabled: boolean;
}

interface Shipping {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "shipping";
  min_days: number;
  max_days: number;
  shipping_rate: number;
}
