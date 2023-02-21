interface Category{
    _id: string;
    _createdAt: string
    _updatedAt: string
    _rev: string;
    _type: "category"
    slug: {
        _type: "slug"
        current: string
    }
    title: string
}

interface Product{
    _id: string;
    _createdAt: string
    _updatedAt: string
    _rev: string;
    _type: "product"
    slug: {
        _type: "slug"
        current: string
    }
    title: string
    image: Image[]
    category: {
        _type: "reference"
        _ref: string
    }
    description: string
    price: number
    quantity: number
}

interface StripeProduct{
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