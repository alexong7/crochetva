import Button from "@/components/Button";
import Header from "@/components/Header";
import { addToBasket } from "@/redux/basketSlice";
import { urlFor } from "@/lib/sanity";
import { fetchParentProducts } from "@/utils/fetchParentProducts";
import { fetchProducts } from "@/utils/fetchProducts";
import { getProductPrice, USDollar } from "@/utils/utils";
import { PortableText } from "@portabletext/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Tooltip } from "@chakra-ui/react";

import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";

import "react-image-gallery/styles/css/image-gallery.css";

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
      toast.error("Select a Colorway then add to bag!", {
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
    return currentProductQuantity <= 0 ? "Out of Stock" : "Add to Bag";
  };

  childProducts.reverse();

  const imageUrls: string[] = [];

  childProducts.forEach((product) => {
    product.image.forEach((image) => imageUrls.push(urlFor(image).url()));
  });

  const images: ReactImageGalleryItem[] = imageUrls.map((image) => {
    const imageGalleryItem = {} as ReactImageGalleryItem;

    imageGalleryItem.original = urlFor(image).url();
    imageGalleryItem.thumbnail = urlFor(image).url();

    return imageGalleryItem;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen overflow-hidden">
      <Head>
        <title>{parentProduct?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="">
        {/* Divider div */}
        <div className="mx-4 divide-y divide-gray-300 lg:mt-4">
          {/* Product Image, Info and Options */}
          <div className="mx-4 mt-4 flex flex-col sm:flex-row">
            <ImageGallery
              items={images}
              useBrowserFullscreen={false}
              showPlayButton={false}
              showFullscreenButton={false}
            />
            {/* Product Title, price, colorways */}
            <div className="mt-6 flex-1  sm:ml-6  sm:mr-0 ">
              <div>
                <p className="text-3xl font-semibold sm:text-5xl ">
                  {parentProduct?.title}
                </p>
                <p className="text-xl text-gray-700  sm:text-2xl">
                  {currentSelectedProduct == null
                    ? getProductPrice(childProducts, parentProduct!)
                    : `$${currentSelectedProduct.price}`}
                </p>
                <p className="mt-3 text-sm text-gray-500 sm:text-base">
                  Colorway: {currentSelectedProduct?.colorName}
                </p>
              </div>

              {/* Rendered Colorway Variants */}
              <div className="mt-2 flex space-x-4">
                {childProducts.map((product, index) => {
                  return (
                    <Tooltip label={product.colorName} hasArrow key={index}>
                      <div key={product._id}>
                        <label key={product._id}>
                          <input
                            onClick={() => {
                              setCurrentSelectedProduct(product);
                              setCurrentProductQuantity(product.quantity);
                            }}
                            type="radio"
                            name="colorOption"
                            id={product.colorName}
                            className=" peer hidden"
                          />
                          <div className="border-[1px] border-transparent p-[2px] hover:border-black peer-checked:border-black">
                            <div
                              className={`h-10 w-10 
                                peer-checked:text-white`}
                              style={{ backgroundColor: product.colorHex }}
                            />
                          </div>
                        </label>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Add to bag */}
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

              <div className="divide-y divide-gray-300">
                {/* Product Description */}
                <div className="flex flex-col items-start justify-center">
                  <div className="mx-6 py-8 md:text-lg">
                    <PortableText value={parentProduct?.description} />
                  </div>
                </div>

                {/* Shipping FAQ Section
                <div className="flex flex-col items-center justify-center lg:mt-6">
                  <p className="mt-4 text-2xl font-semibold">Shipping FAQ</p>
                  <p>Dummy text</p>
                </div> */}
              </div>
            </div>
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
