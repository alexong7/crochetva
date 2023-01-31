import React from "react";
import { Tab } from "@headlessui/react";
import Product from "./Product";

type Props = {
  categories: Category[];
  products: Product[];
};

function ProductPanel({ categories, products }: Props) {
  const showProducts = (category: number) => {
    let filteredProducts = products;

    if (category != Categories.All_Products) {
      filteredProducts = products.filter(
        (product) => product.category._ref === categories[category]._id,
      );
    }

    return filteredProducts.map((product) => (
      <Product product={product} key={product._id} />
    ));
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
