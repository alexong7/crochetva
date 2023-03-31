import React from "react";
import Product from "./Product";
import { Tab } from "@headlessui/react";

type Props = {
  categories: Category[];
  parentProducts: ParentProduct[];
  products: Product[];
};

function ProductPanel({ categories, parentProducts, products }: Props) {
  const slugToIndex: { [slug: string]: number } = {};

  // Loop through the categories, pair each slug to the curernt index.
  // This ensures when we render our categories that we make sure the right
  // products for the Tab Panel get rendered since the order of the Array
  // will not be guaranteed
  for (let i = 0; i < categories.length; i++) {
    slugToIndex[categories[i].slug.current] = i;
  }

  const showProducts = (category_slug: string) => {
    let filteredProducts = parentProducts;
    let alreadyShownProducts = new Set();

    console.log("categories", categories);

    // If we're not showing All Products, filter
    // through the parent products based on category.
    // Else return all parent products to display
    if (category_slug != ALL_PRODUCTS_SLUG) {
      filteredProducts = parentProducts.filter(
        (product) =>
          product.category._ref === categories[slugToIndex[category_slug]]._id,
      );
    }

    return filteredProducts.map((product) => {
      let filteredName = product.title.split("(");
      if (!alreadyShownProducts.has(filteredName[0])) {
        alreadyShownProducts.add(filteredName[0]);
        return (
          <Product
            product={product}
            key={product._id}
            childProducts={products}
          />
        );
      }
    });
  };

  return (
    <div className="space-y-10 py-16">
      <h1 className="text-center text-4xl font-medium tracking-wide text-black md:text-5xl">
        Shop Now
      </h1>

      <Tab.Group>
        <Tab.List className="flex justify-center">
          {AllProductsTab()}
          {categories.map((category) => {
            // Render all tabs besides All Products, that gets manually
            // rendered first above, always.
            if (category.slug.current !== ALL_PRODUCTS_SLUG) {
              return (
                <Tab
                  key={category._id}
                  id={category._id}
                  className={({ selected }) =>
                    `whitespace-nowrap rounded-t-lg py-3 px-5 text-sm font-light outline-none md:py-4 md:px-6 md:text-base ${
                      selected
                        ? "gradient border-b-2 border-[#35383C] text-white"
                        : "border-b-2 border-[#35383C] text-[#747474]"
                    }`
                  }
                >
                  {category.title}
                </Tab>
              );
            }
          })}
        </Tab.List>
        <Tab.Panels className="mx-auto max-w-fit pt-10 pb-24 sm:px-4">
          <Tab.Panel className="tabPanel">
            {showProducts(ALL_PRODUCTS_SLUG)}
          </Tab.Panel>

          {categories.map((category) => {
            if (category.slug.current !== ALL_PRODUCTS_SLUG) {
              return (
                <Tab.Panel key={category._id} className="tabPanel">
                  {showProducts(category.slug.current)}
                </Tab.Panel>
              );
            }
          })}

          {/* <Tab.Panel className="tabPanel">{showProducts(1)}</Tab.Panel>
          <Tab.Panel className="tabPanel">{showProducts(2)}</Tab.Panel>
          <Tab.Panel className="tabPanel">{showProducts(3)}</Tab.Panel> */}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ProductPanel;

const ALL_PRODUCTS_SLUG = "all-products";

const AllProductsTab = () => (
  <Tab
    key={"allProducts"}
    id={"allProductsId"}
    className={({ selected }) =>
      `whitespace-nowrap rounded-t-lg py-3 px-5 text-sm font-light outline-none md:py-4 md:px-6 md:text-base ${
        selected
          ? "gradient border-b-2 border-[#35383C] text-white"
          : "border-b-2 border-[#35383C] text-[#747474]"
      }`
    }
  >
    All Products
  </Tab>
);
