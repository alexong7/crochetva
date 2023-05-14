import { addToBasket, removeFromBasket } from "@/redux/basketSlice";
import { urlFor } from "@/lib/sanity";
import { USDollar } from "@/utils/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Menu } from "@headlessui/react";
import { useMediaQuery } from "react-responsive";

interface Props {
  items: Product[];
  parentProducts: ParentProduct[];
  id: string;
}

function CheckoutProduct({ id, items, parentProducts }: Props) {
  const dispatch = useDispatch();

  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }));

    toast.error(`${items[0].title} removed from basket`, {
      position: "bottom-center",
    });
  };

  const addItemToBasket = () => {
    dispatch(addToBasket(items[0]));
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  const quantityOptions: number[] = [];

  // Controls the Quantity Dropdown values.
  // Currently 1 - 5
  for (let i = 1; i <= 5; i++) {
    quantityOptions.push(i);
  }

  // Get all the custom options if any
  // for this product
  let customOptions = new Map<string, string>();

  for (const key in items[0].customProperties) {
    customOptions.set(key, items[0].customProperties[key]);
  }

  const findParentSlug = () => {
    let parentProduct = parentProducts.find(
      (p) => p._id == items[0].parentProduct._ref,
    );

    return parentProduct?.slug.current;
  };

  const [quantity, setQuantity] = useState(items.length);

  // Helper function to update the UI and Redux state of the Product Quantity
  const handleQuantitySelection = (newQuantity: number) => {
    let oldQuantity = quantity;
    let difference = Math.abs(newQuantity - oldQuantity);

    // Check if we need to add more items to the basket
    if (oldQuantity < newQuantity) {
      for (let i = 0; i < difference; i++) {
        addItemToBasket();
      }
    }

    // Check if we need to remove items from basket
    if (oldQuantity > newQuantity) {
      for (let i = 0; i < difference; i++) {
        dispatch(removeFromBasket({ id }));
      }
    }

    // Update state
    setQuantity(newQuantity);
  };

  return (
    <div className="flex flex-col gap-x-4 space-y-2 border-b border-gray-300 pb-5 lg:flex-row">
      {/* Image Div */}
      <Link
        href={findParentSlug() != null ? `/products/${findParentSlug()}` : ""}
      >
        <div className="flex items-center justify-between">
          <div className="relative mt-4 h-44 w-44">
            <Image
              src={urlFor(items[0].image[0]).url()}
              alt=""
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </Link>

      {/* Title, Quantitiy, Product details */}
      <div className="flex flex-1 flex-col items-end justify-center lg:items-center lg:space-y-2">
        <div className="flex w-full">
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl">
              <Link
                href={
                  findParentSlug() != null
                    ? `/products/${findParentSlug()}`
                    : ""
                }
              >
                <h4 className="font-semibold lg:w-96">{items[0].title}</h4>
              </Link>

              <div className="relative flex-col items-end  gap-x-1 font-semibold">
                <Menu>
                  <Menu.Button>
                    <div className="flex items-center gap-x-1">
                      <p>{quantity}</p>
                      <ChevronDownIcon className="  h-5 w-5 text-blue-500 hover:text-blue-600" />
                    </div>
                  </Menu.Button>

                  <Menu.Items className="absolute z-50 mt-2 flex w-12 flex-col items-center justify-center space-y-1 divide-y divide-slate-300 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-10 focus:outline-none">
                    {quantityOptions.map((i) => {
                      return (
                        <Menu.Item key={i}>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-violet-500 text-white"
                                  : "text-gray-900"
                              }  w-full  px-2 py-2`}
                              onClick={() => handleQuantitySelection(i)}
                            >
                              {i}
                            </button>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>

          {/* Total, Remove on RH side */}
          <div className="flex flex-col items-end">
            <h4 className="text-xl font-semibold lg:text-2xl">
              {USDollar.format(
                items.reduce((total, items) => total + items.price, 0),
              )}
            </h4>

            <button
              onClick={removeItemFromBasket}
              className="text-blue-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Custom Product Options for Non-Mobile */}
        {items[0].isCustom && !isTabletOrMobile && (
          <div className="flex w-full ">
            <div className="flex-1 text-xl font-semibold text-black">
              Options
            </div>
            <div className="flex flex-col items-end">
              {Object.keys(items[0].customProperties).map((key, index) => (
                <p key={index} className="text-sm text-gray-500">
                  {`${key}: ${items[0].customProperties[key]}`}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Product Options for Mobile View */}
      {items[0].isCustom && isTabletOrMobile && (
        <div className="flex flex-1 items-center">
          <div className="flex-1 text-xl font-semibold text-black">Options</div>
          <div className="flex flex-col items-end">
            {Object.keys(items[0].customProperties).map((key, index) => (
              <p key={index} className="text-sm text-gray-500">
                {`${key}: ${items[0].customProperties[key]}`}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutProduct;

const text =
  "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
