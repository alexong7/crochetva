import { addToBasket } from "@/redux/basketSlice";
import { urlFor } from "@/sanity";
import { ShoppingCartIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type Props = {
  product: ParentProduct;
  childProducts: Product[];
};

function Product({ product, childProducts }: Props) {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    let childProduct = childProducts.find(
      (x) => x._id === product.childProduct._ref,
    );
    dispatch(addToBasket(childProduct!));

    toast.success(`${childProduct?.title} added to basket`, {
      position: "bottom-center",
    });
  };

  return (
    <Link href={`/product/${product.slug.current}`}>
      <div
        className="md:p-10` flex h-fit w-[320px] select-none flex-col space-y-3 
      rounded-xl bg-[#ffffff] p-8 md:h-[500px] md:w-[400px]"
      >
        <div className="relative h-64 w-full md:h-72">
          <Image
            src={urlFor(product.image[0]).url()}
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="flex flex-1 items-center justify-between space-x-3">
          <div className="space-y-2 text-xl text-black md:text-2xl">
            <p>{product.title}</p>
            {product.quantity == 0 && <p>(Out of stock)</p>}

            <p>${product.price}</p>
          </div>

          <div
            className="gradient z-50 flex h-12 w-12 flex-shrink-0 cursor-pointer
          items-center justify-center rounded-full md:h-[70px] md:w-[70px]"
            onClick={(e) => {
              product.quantity == 0 ? () => {} : addItemToBasket();
              e.stopPropagation();
              e.nativeEvent.preventDefault();
            }}
          >
            {product.quantity == 0 ? (
              <XCircleIcon className="h-10 w-10 text-white" />
            ) : (
              <ShoppingCartIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Product;
