import { removeFromBasket } from "@/redux/basketSlice";
import { urlFor } from "@/sanity";
import { USDollar } from "@/utils/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface Props {
  items: Product[];
  id: string;
}

function CheckoutProduct({ id, items }: Props) {
  const dispatch = useDispatch();

  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }));

    toast.error(`${items[0].title} removed from basket`, {
      position: "bottom-center",
    });
  };

  return (
    <div className="flex flex-col gap-x-4 space-y-2 border-b border-gray-300 pb-5 lg:flex-row">
      {/* Image Div */}
      <div className="relative mt-4 h-44 w-44">
        <Image
          src={urlFor(items[0].image[0]).url()}
          alt=""
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Title, Quantitiy, Product details */}
      <div className="flex flex-1 items-end lg:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl">
            <h4 className="font-semibold lg:w-96">{items[0].title}</h4>
            <p className="flex items-end gap-x-1 font-semibold">
              {items.length}
            </p>
          </div>
        </div>

        {/* Total, Remove on RH side */}
        <div className="flex flex-col items-end space-y-4">
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
    </div>
  );
}

export default CheckoutProduct;

const text =
  "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
