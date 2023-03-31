export const USDollar = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function fetchPostJSON(url: string, data?: {}) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw err;
  }
}

export function getProductPrice(
  childProducts: Product[],
  parentProduct: ParentProduct,
) {
  // Determine price range if any
  let minPrice: number = Number.MAX_SAFE_INTEGER;
  let maxPrice: number = -1;
  let price: string;

  // Find the price range to display if variant
  // products vary in price.
  childProducts.map((product) => {
    if (product.price > maxPrice) {
      maxPrice = product.price;
    }
    if (product.price < minPrice) {
      minPrice = product.price;
    }
  });

  if (maxPrice === minPrice) {
    price = `$${minPrice.toString()}`;
  } else {
    price = `$${minPrice} - $${maxPrice}`;
  }

  // If there are no child product prices, or something went
  // wrong, fallback to the parent product price.
  if (minPrice == -1 || maxPrice == Number.MAX_SAFE_INTEGER) {
    price = `$${parentProduct?.price}`;
  }

  return price;
}
