import React from "react";
import Product from "./Product";
import { Tab } from "@headlessui/react";

type Props = {
  categories: Category[];
  parentProducts: ParentProduct[];
  products: Product[];
};

function ProductPanel({ categories, parentProducts, products }: Props) {
  const showProducts = (category: number) => {
    let filteredProducts = parentProducts;
    let alreadyShownProducts = new Set();

    if (category != Categories.All_Products) {
      filteredProducts = parentProducts.filter(
        (product) => product.category._ref === categories[category]._id,
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
          {categories.map((category) => (
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
          ))}
        </Tab.List>
        <Tab.Panels className="mx-auto max-w-fit pt-10 pb-24 sm:px-4">
          <Tab.Panel className="tabPanel">
            {showProducts(Categories.All_Products)}
          </Tab.Panel>
          <Tab.Panel className="tabPanel">{showProducts(1)}</Tab.Panel>
          <Tab.Panel className="tabPanel">{showProducts(2)}</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ProductPanel;

enum Categories {
  All_Products,
}
