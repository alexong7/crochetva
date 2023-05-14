export const fetchCustomProducts = async (orderId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/custom/${orderId}`,
  );

  const data = await res.json();
  const customProducts: CustomOrderProduct[] = data.customProducts;
  return customProducts;
};
