import Button from "@/components/Button";
import Header from "@/components/Header";
import { addToBasket } from "@/redux/basketSlice";
import { urlFor } from "@/sanity";
import product from "@/sanity/schemas/product";
import { fetchParentProducts } from "@/utils/fetchParentProducts";
import { fetchProducts } from "@/utils/fetchProducts";
import { USDollar } from "@/utils/utils";
import { PortableText } from "@portabletext/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface Props {
  products: Product[];
  parentProducts: ParentProduct[];
}

function ProductScreen({ products, parentProducts }: Props) {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { slug } = query;

  const parentProduct = parentProducts.find(
    (product) => product.slug.current === slug,
  );

  const childProducts: Product[] = products.filter(
    (product) => product.parentProduct._ref === parentProduct?._id,
  );

  /// States
  const [currentSelectedProduct, setCurrentSelectedProduct] =
    useState<Product | null>(null);

  const [currentProductQuantity, setCurrentProductQuantity] = useState(1);

  const addItemToBasket = (product: Product | null) => {
    if (product == null) {
      toast.error("Select a Colorway then add to cart!", {
        position: "bottom-center",
      });
      return;
    }
    dispatch(addToBasket(product!));

    toast.success(`${product?.title} added to basket`, {
      position: "bottom-center",
    });
  };

  const getButtonTitle: () => string = () => {
    return currentProductQuantity <= 0 ? "Out of Stock" : "Add to Cart";
  };

  const getProductPrice = () => {
    if (currentSelectedProduct == null) {
      return parentProduct?.price;
    }

    return currentSelectedProduct.price;
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <Head>
        <title>{parentProduct?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className=" min-h-screen">
        {/* Divider div */}
        <div className="mx-4 divide-y divide-gray-300 lg:mt-4">
          {/* Product Image, Info and Options */}
          <div className="mx-4 mt-6 flex flex-col  sm:flex-row">
            <div className="flex justify-center">
              <div className="lg:w- relative h-[400px] w-[300px] sm:h-[500px] sm:w-[400px]">
                <Image
                  src={urlFor(parentProduct?.image[0]).url()}
                  alt=""
                  objectFit=""
                  layout="fill"
                />
              </div>
            </div>

            {/* Product Title, price, colorways */}
            <div className="mt-6 flex-1  sm:ml-6  sm:mr-0 ">
              <div>
                <p className="text-3xl font-semibold sm:text-5xl ">
                  {parentProduct?.title}
                </p>
                <p className="text-xl text-gray-700  sm:text-2xl">
                  {USDollar.format(getProductPrice()!)}
                </p>
                <p className="mt-3 text-sm text-gray-500 sm:text-base">
                  Colorways
                </p>
              </div>

              {/* Rendered Colorway Variants */}
              <div className="mt-2 flex">
                {childProducts.map((product) => (
                  <div key={product._id}>
                    <label key={product._id}>
                      <input
                        onClick={() => {
                          setCurrentSelectedProduct(product);
                          setCurrentProductQuantity(product.quantity);
                          console.log(product.title);
                          console.log(currentProductQuantity);
                        }}
                        type="radio"
                        name="colorOption"
                        id={product.color}
                        className=" peer hidden "
                      />
                      <div
                        className={`mr-6 rounded-md border-[1px] border-black px-4 peer-checked:bg-black peer-checked:text-white`}
                      >
                        {product.color}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Add to cart */}
              <div className="mt-6 max-w-full ">
                <Button
                  title={getButtonTitle()}
                  width="w-full"
                  noIcon
                  onClick={() =>
                    currentProductQuantity <= 0
                      ? () => {}
                      : addItemToBasket(currentSelectedProduct!)
                  }
                />
              </div>

              {/* Product Description */}
              <div className="flex flex-col items-start justify-center">
                <div className="mx-6 py-8">
                  <PortableText value={parentProduct?.description} />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping FAQ Section */}
          <div className="flex flex-col items-center justify-center lg:mt-6">
            <p className="mt-4 text-2xl font-semibold">Shipping FAQ</p>
            <p>Dummy text</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductScreen;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const products = await fetchProducts();
  const parentProducts = await fetchParentProducts();

  return {
    props: {
      products,
      parentProducts,
    },
  };
};
