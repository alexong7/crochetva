export const fetchProductById = async (productId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${productId}`,
  );

  const data = await res.json();
  const product: Product = data.product;
  return product;
};
