import { addToBasket } from "@/redux/basketSlice";
import { urlFor } from "@/sanity";
import { getProductPrice } from "@/utils/utils";
import { ShoppingCartIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type Props = {
  product: ParentProduct;
  childProducts: Product[];
};

function Product({ product, childProducts }: Props) {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    if (currentSelectedProduct == null) {
      toast.error("Select a Colorway then add to bag!", {
        position: "bottom-center",
      });
      return;
    }

    dispatch(addToBasket(currentSelectedProduct!));

    toast.success(`${currentSelectedProduct?.title} added to basket`, {
      position: "bottom-center",
    });
  };

  const filteredProducts: Product[] = childProducts.filter(
    (x) => x.parentProduct._ref === product?._id,
  );

  const mainChildProduct = childProducts.find(
    (childProduct) => product.childProduct._ref === childProduct._id,
  );

  const [currentSelectedProduct, setCurrentSelectedProduct] =
    useState<Product | null>(null);

  return (
    <Link href={`/products/${product.slug.current}`}>
      <div
        className="md:p-10` flex h-fit w-[320px] select-none flex-col space-y-3 
      rounded-xl bg-[#ffffff] p-8 md:h-[500px] md:w-[400px]"
      >
        <div className="relative h-64 w-full md:h-72">
          <Image
            src={urlFor(
              currentSelectedProduct?.image[0] || mainChildProduct?.image[0],
            ).url()}
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="flex flex-1 items-center justify-between space-x-3">
          <div className="space-y-2 text-xl text-black md:text-2xl">
            <p className="font-medium">{product.title}</p>
            {currentSelectedProduct != null &&
              (currentSelectedProduct?.quantity! <= 0 ||
                currentSelectedProduct?.quantity == null) && (
                <p className="text-[16px] text-gray-600">(Out of stock)</p>
              )}

            <p>
              {currentSelectedProduct == null
                ? getProductPrice(filteredProducts, product)
                : `$${currentSelectedProduct.price}`}
            </p>
            <div
              className="flex"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {filteredProducts.map((product, index) => {
                return (
                  <div key={product._id}>
                    <label key={product._id}>
                      <input
                        onClick={(e) => {
                          setCurrentSelectedProduct(product);
                        }}
                        type="radio"
                        name="colorOption"
                        id={product.colorName}
                        className=" peer hidden"
                      />
                      <div className="border-[1px] border-transparent p-[2px] hover:border-black peer-checked:border-black">
                        <div
                          className={`h-6 w-6  peer-checked:text-white`}
                          style={{ backgroundColor: product.colorHex }}
                        />
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="gradient z-50 flex h-12 w-12 flex-shrink-0 cursor-pointer
          items-center justify-center rounded-full md:h-[70px] md:w-[70px]"
            onClick={(e) => {
              currentSelectedProduct != null &&
              (currentSelectedProduct?.quantity! <= 0 ||
                currentSelectedProduct?.quantity == null)
                ? () => {}
                : addItemToBasket();
              e.stopPropagation();
              e.nativeEvent.preventDefault();
            }}
          >
            {currentSelectedProduct != null &&
            (currentSelectedProduct?.quantity! <= 0 ||
              currentSelectedProduct?.quantity == null) ? (
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
