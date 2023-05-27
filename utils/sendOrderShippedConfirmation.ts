export const sendOrderShippedConfirmation = async (data: {}) => {
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orderShipped`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};
