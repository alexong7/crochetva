

export const sendOrderConfirmation = async (data: {}) => {
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orderConfirmation`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};
