export const fetchOrder = async (orderId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}`,
  );

  const data = await res.json();
  const order: Order = data.order;
  return order;
};
