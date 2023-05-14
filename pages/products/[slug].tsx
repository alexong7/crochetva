import Button from "@/components/Button";
import Header from "@/components/Header";
import { addToBasket } from "@/redux/basketSlice";
import { sanityClient, urlFor } from "@/lib/sanity";
import { getProductPrice } from "@/utils/utils";
import { PortableText } from "@portabletext/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps, GetServerSideProps } from "next/types";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Tooltip } from "@chakra-ui/react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

import { ReactImageGalleryItem } from "react-image-gallery";

import "react-image-gallery/styles/css/image-gallery.css";
import dynamic from "next/dynamic";
import {
  queryColors,
  queryCustomColorLabels,
  queryFlags,
  queryParentProducts,
  queryProducts,
} from "@/utils/queries";
import { DISABLE_CUSTOM_FLAG, DISABLE_INVENTORY_FLAG } from "@/constants/flags";

interface Props {
  products: Product[];
  parentProducts: ParentProduct[];
  colors: Color[];
  customColorLabels: CustomColorLabel[];
  flags: Flag[];
}

const DynamicImageGallery = dynamic(() => import("react-image-gallery"), {
  loading: () => <p>Loading...</p>,
});

function ProductScreen({
  products,
  parentProducts,
  customColorLabels,
  colors,
  flags,
}: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;

  // Find specific products
  const parentProduct = parentProducts?.find(
    (product) => product.slug.current === slug,
  );

  const childProducts: Product[] = products?.filter(
    (product) =>
      product.parentProduct._ref === parentProduct?._id &&
      product.colorName != null &&
      !product.isCustom,
  );

  const customProduct: Product | undefined = products?.find(
    (product) =>
      product.parentProduct._ref === parentProduct?._id && product.isCustom,
  );

  /// Flags
  const inventoryDisabledFlag = flags?.find(
    (flag) => flag.name === DISABLE_INVENTORY_FLAG,
  );
  const customOrdersDisabledFlag = flags.find(
    (flag) => flag.name === DISABLE_CUSTOM_FLAG,
  );

  const inventoryDisabled = inventoryDisabledFlag?.enabled ?? false;
  const customOrdersDisabled = customOrdersDisabledFlag?.enabled ?? false;

  /// States
  const [currentSelectedProduct, setCurrentSelectedProduct] =
    useState<Product | null>(null);

  const [currentProductQuantity, setCurrentProductQuantity] = useState(1);

  const [customizeOptions, setCustomizeOptions] = useState(false);

  const [selectedCustomColor1, setSelectedCustomColor1] =
    useState<Color | null>(null);
  const [selectedCustomColor2, setSelectedCustomColor2] =
    useState<Color | null>(null);
  const [selectedCustomColor3, setSelectedCustomColor3] =
    useState<Color | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Helper method to handle adding items to basket
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

  // Helper method to handle adding custom items to basket
  const addCustomItemToBasket = () => {
    // Early out
    if (
      (!hasCustomColors1 && !hasCustomColors2 && !hasCustomColors3) ||
      customProduct === null ||
      customProduct === undefined
    ) {
      return;
    }

    if (
      hasCustomColors1 &&
      (selectedCustomColor1 === null || selectedCustomColor1 === undefined)
    ) {
      toast.error(`Select a Color for ${customColorHeader1?.name}`, {
        position: "bottom-center",
      });
      return;
    }

    if (
      hasCustomColors2 &&
      (selectedCustomColor2 === null || selectedCustomColor2 === undefined)
    ) {
      toast.error(`Select a Color for ${customColorHeader2?.name}`, {
        position: "bottom-center",
      });
      return;
    }

    if (
      hasCustomColors3 &&
      (selectedCustomColor3 === null || selectedCustomColor3 === undefined)
    ) {
      toast.error(`Select a Color for ${customColorHeader3?.name}`, {
        position: "bottom-center",
      });
      return;
    }

    let customColorsObject: { [key: string]: string } = {};

    if (hasCustomColors1) {
      customColorsObject[customColorHeader1?.name!] =
        selectedCustomColor1?.name!;
    }
    if (hasCustomColors2) {
      customColorsObject[customColorHeader2?.name!] =
        selectedCustomColor2?.name!;
    }
    if (hasCustomColors3) {
      customColorsObject[customColorHeader3?.name!] =
        selectedCustomColor3?.name!;
    }

    // Create a new product so that we can populate
    // custom properties to send to the next page.
    // This does not get persisted to the database
    let product: Product = {
      _id: customProduct._id,
      _createdAt: customProduct._createdAt,
      _updatedAt: customProduct._updatedAt,
      _rev: customProduct._rev,
      _type: "product",
      slug: {
        _type: "slug",
        current: customProduct.slug.current,
      },
      parentProduct: {
        _type: "reference",
        _ref: customProduct.parentProduct._ref,
      },
      customProperties: customColorsObject,
      title: customProduct.title,
      colorName: "",
      colorHex: "",
      productFamily: customProduct.productFamily,
      image: customProduct.image,
      category: {
        _type: "reference",
        _ref: customProduct.category._ref,
      },
      price: customProduct.price,
      quantity: customProduct.quantity,
      isCustom: true,
    };

    dispatch(addToBasket(product));

    toast.success(`${product?.title} added to basket`, {
      position: "bottom-center",
    });
  };

  const getButtonTitle: () => string = () => {
    // If in custom mode, do a check for
    // if there is a custom item and if
    // the custom product is in stock
    if (customizeOptions) {
      return customProduct === undefined ||
        customProduct === null ||
        customProduct.quantity <= 0 ||
        customOrdersDisabled
        ? "Out of Stock"
        : "Add to Bag";
    }
    return currentProductQuantity <= 0 || inventoryDisabled
      ? "Out of Stock"
      : "Add to Bag";
  };

  childProducts?.reverse();

  // Handles adding our Product images to React Image Gallery
  const imageUrls: string[] = [];

  childProducts?.forEach((product) => {
    product.image.forEach((image) => imageUrls.push(urlFor(image).url()));
  });

  const images: ReactImageGalleryItem[] = imageUrls.map((image) => {
    const imageGalleryItem = {} as ReactImageGalleryItem;

    imageGalleryItem.original = urlFor(image).url();
    imageGalleryItem.thumbnail = urlFor(image).url();

    return imageGalleryItem;
  });

  // Helper to find the Custom Colors for each of the three sections
  const findCustomColors = (type: CustomColorType) => {
    const customColorsSet = new Set<string>();
    let customColorsArray = [];
    let hasCustomColors;

    switch (type) {
      case CustomColorType.CUSTOM_COLOR_1:
        customColorsArray = parentProduct?.customColors1!;
        hasCustomColors = hasCustomColors1;
        break;
      case CustomColorType.CUSTOM_COLOR_2:
        customColorsArray = parentProduct?.customColors2!;
        hasCustomColors = hasCustomColors2;
        break;
      case CustomColorType.CUSTOM_COLOR_3:
        customColorsArray = parentProduct?.customColors3!;
        hasCustomColors = hasCustomColors3;
        break;
    }

    if (hasCustomColors) {
      customColorsArray.forEach((color) => customColorsSet.add(color._ref));
    }

    return hasCustomColors
      ? colors.filter((color) => customColorsSet.has(color._id))
      : null;
  };

  /// Boolean values, checks for Custom Colors. Each product
  /// has potentially up to three areas that can be customized.
  const hasCustomColors1 =
    parentProduct?.customColorHeader1 != null &&
    parentProduct?.customColors1 != null &&
    parentProduct?.customColorHeader1 != undefined &&
    parentProduct?.customColors1 != undefined;
  const hasCustomColors2 =
    parentProduct?.customColorHeader2 != null &&
    parentProduct?.customColors2 != null &&
    parentProduct?.customColorHeader2 != undefined &&
    parentProduct?.customColors2 != undefined;
  const hasCustomColors3 =
    parentProduct?.customColorHeader3 != null &&
    parentProduct?.customColors3 != null &&
    parentProduct?.customColorHeader3 != undefined &&
    parentProduct?.customColors3 != undefined;

  const customColorHeader1 = hasCustomColors1
    ? customColorLabels.find(
        (label) => label._id === parentProduct?.customColorHeader1?._ref,
      )
    : null;
  const customColors1 = hasCustomColors1
    ? findCustomColors(CustomColorType.CUSTOM_COLOR_1)
    : null;

  const customColorHeader2 = hasCustomColors2
    ? customColorLabels.find(
        (label) => label._id === parentProduct?.customColorHeader2?._ref,
      )
    : null;
  const customColors2 = hasCustomColors2
    ? findCustomColors(CustomColorType.CUSTOM_COLOR_2)
    : null;

  const customColorHeader3 = hasCustomColors3
    ? customColorLabels.find(
        (label) => label._id === parentProduct?.customColorHeader3?._ref,
      )
    : null;
  const customColors3 = hasCustomColors3
    ? findCustomColors(CustomColorType.CUSTOM_COLOR_3)
    : null;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!mounted) return null;

  // Function to return each Custom Color Section JSX element
  const customColorSection = (type: CustomColorType) => {
    let customColorLabel: CustomColorLabel | null = null;
    let customColors: Color[] | null = null;
    let colorName: string | undefined = "";
    let radioName = "";

    switch (type) {
      case CustomColorType.CUSTOM_COLOR_1:
        customColorLabel = customColorHeader1!;
        customColors = customColors1!;
        colorName = selectedCustomColor1?.name;
        radioName = "customColor1";
        break;
      case CustomColorType.CUSTOM_COLOR_2:
        customColorLabel = customColorHeader2!;
        customColors = customColors2!;
        colorName = selectedCustomColor2?.name;
        radioName = "customColor2";
        break;
      case CustomColorType.CUSTOM_COLOR_3:
        customColorLabel = customColorHeader3!;
        customColors = customColors3!;
        colorName = selectedCustomColor3?.name;
        radioName = "customColor3";
        break;
    }

    return (
      <div className="mt-6 ">
        <p className="mt-3 text-sm text-gray-500 sm:text-base">
          {customColorLabel?.name}: {colorName}
        </p>

        {/* Custom Colors*/}
        <div className="mt-2 flex space-x-4">
          {customColors?.map((color, index) => {
            return (
              <Tooltip label={color.name} hasArrow key={index}>
                <div key={color._id}>
                  <label key={color._id}>
                    <input
                      onClick={() => {
                        switch (type) {
                          case CustomColorType.CUSTOM_COLOR_1:
                            setSelectedCustomColor1(color);
                            break;
                          case CustomColorType.CUSTOM_COLOR_2:
                            setSelectedCustomColor2(color);
                            break;
                          case CustomColorType.CUSTOM_COLOR_3:
                            setSelectedCustomColor3(color);
                            break;
                        }
                      }}
                      type="radio"
                      name={radioName}
                      id={color.name}
                      className="peer hidden"
                    />
                    <div className="border-[1px] border-transparent p-[2px] hover:border-black peer-checked:border-black">
                      <div
                        className={`h-10 w-10 
                                  peer-checked:text-white`}
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                  </label>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className=" overflow-hidden">
      <Head>
        <title>{parentProduct?.title}</title>
        <link rel="icon" href="/Logo2.png" />
      </Head>

      <Header />

      <main className="">
        {/* Divider div */}
        <div className="mx-4 divide-y divide-gray-300 lg:mt-4">
          {/* Product Image, Info and Options */}
          <div className="mx-4 mt-4 flex flex-col sm:flex-row ">
            <DynamicImageGallery
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
                  {customizeOptions
                    ? `$${customProduct?.price}`
                    : currentSelectedProduct == null
                    ? getProductPrice(childProducts, parentProduct!)
                    : `$${currentSelectedProduct.price}`}
                </p>
              </div>

              {!customizeOptions && (
                <div className="mt-3">
                  <p className=" text-sm text-gray-500 sm:text-base">
                    Colorway: {currentSelectedProduct?.colorName}
                  </p>
                </div>
              )}

              {/* Rendered Colorway Variants */}
              {!customizeOptions && (
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
              )}

              {hasCustomColors1 &&
                customizeOptions &&
                customColorSection(CustomColorType.CUSTOM_COLOR_1)}

              {hasCustomColors2 &&
                customizeOptions &&
                customColorSection(CustomColorType.CUSTOM_COLOR_2)}

              {hasCustomColors3 &&
                customizeOptions &&
                customColorSection(CustomColorType.CUSTOM_COLOR_3)}

              {!customizeOptions &&
                (hasCustomColors1 || hasCustomColors2 || hasCustomColors3) &&
                customProduct != null &&
                customProduct != undefined && (
                  <div className="mt-6">
                    <div
                      className=" flex items-center justify-center space-x-2 rounded-full border-[0.5px] border-black py-4 px-28"
                      onClick={() => {
                        setCustomizeOptions(true);
                        setCurrentSelectedProduct(null);
                      }}
                    >
                      <p>Customize</p>

                      <div>
                        <CustomColorIcon />
                      </div>
                    </div>
                  </div>
                )}

              {customizeOptions && (
                <div className="mt-6">
                  <div
                    className=" flex items-center justify-center space-x-2 rounded-full border-[0.5px] border-black py-4 px-28"
                    onClick={() => {
                      setCustomizeOptions(false);
                      setSelectedCustomColor1(null);
                      setSelectedCustomColor2(null);
                      setSelectedCustomColor3(null);
                    }}
                  >
                    <p>Presets</p>

                    <div className="h-4 w-4">
                      <ArrowUturnLeftIcon />
                    </div>
                  </div>
                </div>
              )}

              {/* Add to bag */}
              <div className="mt-6 max-w-full ">
                <Button
                  title={getButtonTitle()}
                  width="w-full"
                  noIcon
                  onClick={() => {
                    // Custom Product Logic
                    if (customizeOptions) {
                      if (
                        customProduct === undefined ||
                        customProduct === null ||
                        customProduct?.quantity <= 0 ||
                        customOrdersDisabled
                      ) {
                        toast.error(`Out of Stock!`, {
                          position: "bottom-center",
                        });
                        return () => {};
                      }

                      return addCustomItemToBasket();
                    }

                    // Regular Product logic
                    if (currentProductQuantity <= 0 || inventoryDisabled) {
                      toast.error(`Out of Stock!`, {
                        position: "bottom-center",
                      });
                      return () => {};
                    }

                    return addItemToBasket(currentSelectedProduct!);
                  }}
                />
              </div>

              <div className="divide-y divide-gray-300">
                {/* Product Description */}
                <div className="flex flex-col items-start justify-center">
                  <div className="mx-6 py-8 md:text-lg">
                    <PortableText value={parentProduct?.description} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductScreen;

export const getStaticPaths: GetStaticPaths = async () => {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  const parentProducts = await sanityClient.fetch(queryParentProducts);

  const slugs = parentProducts.map(
    (product: any) => `/products/${product.slug.current}`,
  );

  return {
    paths: slugs,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const products = await sanityClient.fetch(queryProducts);
  const parentProducts = await sanityClient.fetch(queryParentProducts);
  const colors = await sanityClient.fetch(queryColors);
  const customColorLabels = await sanityClient.fetch(queryCustomColorLabels);
  const flags = await sanityClient.fetch(queryFlags);

  return {
    props: {
      products,
      parentProducts,
      colors,
      customColorLabels,
      flags,
    },
    revalidate: 30,
  };
};

// SVG Logo
const CustomColorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 18"
  >
    <defs>
      <clipPath id="nby-buttonclip-path" transform="translate(-1056 -277.8489)">
        <path
          d="M1065.02,280H1058a1,1,0,0,0-1,1v14a1,1,0,0,0,1,1h14.0029a1,1,0,0,0,1-1v-7.0111a1,1,0,0,0-2,0V295l1-1H1058l1,1V281l-1,1h7.02a1,1,0,0,0,0-2Z"
          fill="none"
        ></path>
      </clipPath>
      <clipPath
        id="nby-buttonclip-path-2"
        transform="translate(-1056 -277.8489)"
      >
        <rect width="1440" height="2259" fill="none"></rect>
      </clipPath>
      <clipPath
        id="nby-buttonclip-path-3"
        transform="translate(-1056 -277.8489)"
      >
        <rect x="1056" y="279" width="20" height="21" fill="none"></rect>
      </clipPath>
    </defs>
    <g id="Layer_2">
      <g id="Layer_1-2">
        <g clip-path="url(#nby-buttonclip-path)">
          <g clip-path="url(#nby-buttonclip-path-2)">
            <g clip-path="url(#nby-buttonclip-path-3)">
              <image
                width="18"
                height="18"
                transform="translate(0 0)"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAACXBIWXMAAAsSAAALEgHS3X78AAACi0lEQVQ4T62UPY4kRRCFv4jM+ununZFWI3CQwAEPE27BBeAcOFwEgxvgcAY8LrDeeoswQILVzkx3/WRGBEZmzywGWKSUSlWq8qsX70WlRAT/18g//PRFFBF20TZV2URZRVk0sWpiEaX4iWJHih2pdqD6gWoT5hMWI798/a3kHA4ogROAh1AJkgSJQGjKIwSP1GfGPGMxYDFiPjZlYwTCFRh4OAbUEDRAAhAIlIiE+4D5iMeI+4T5P2COIEivOwIMoUSQw1G07yseGY8Gqz5RvZf5PkwRtAkAh1DBQthRUlw/kjAfqD632X0zm7AYGmxyJ4s0jyRQaacN2ETJ6u05Bsxnih0o1sKofuhldtgchoUwiFCuwG56EeXsCRKYT+z1BXu9Za83HTZ173KDHdxxAQuhijOJMoUy9P67aAJgrzcs5Y6l3LHXE+ZzDyITkZ6VRcA1UxPBRDi5cnQD4PV04t3yCe+Wj9nrbe+tgYhEhBI9pHzoB/5tfLY98t2bH//znevIB7enJMVpzleQDXgQ9Ffl1c9f8f2X3/Dqg0/58/iSyzCzpZGqGVPFpCvLG9AhUoFdYAM5C/KXoG9a+Z//8RqA324+5O18y3k8suaJPQ3U7muWBagCFShd0SLIQ4PJY2vnu8tbPrr/HYC57txPLzgP8xMQILM0kJSmSlbgIsgDyCOwAcCxrLxc71lz73avjHZkyfPznqxAkWdVqyAXkIsgmyClKZts57RfuN3OVG19lcIZvDL43JVtHbQDmyBLA7IBhRYIkN2Y68apLOxpeDJdw0nuV9h7JW593bvaSgsHSG6MVpjrxqGuFM14B0pv8Hw9KDuw87zWrqr/6Cmc/ATcKbphqoRc7xv4GwWFlj4tYNUmAAAAAElFTkSuQmCC"
              ></image>
            </g>
          </g>
        </g>
        <path
          d="M1062.3486,291.3544a.5.5,0,0,1-.476-.6528l.8437-2.6323a1.5094,1.5094,0,0,1,.3687-.6035l8.3921-8.39a.4921.4921,0,0,1,.1645-.1094,2.0471,2.0471,0,0,1,2.5977,2.5987.5044.5044,0,0,1-.1094.1645l-8.3926,8.3892a1.5163,1.5163,0,0,1-.6035.3682l-2.6328.8432A.4945.4945,0,0,1,1063.3486,290.3544Zm9.7481-11.4838-8.3047,8.3022a.5069.5069,0,0,0-.1235.2022l-.5474,1.707,1.7075-.5469a.5122.5122,0,0,0,.2022-.124l8.3051-8.3013a1.0629,1.0629,0,0,0-1.2392-1.2392Z"
          transform="translate(-1054.25 -279.60)"
          fill="#111111"
        ></path>
        <path
          d="M1066.8281,288.9892l-.9258-.3779.4629.1889-.4653-.1826a1.0531,1.0531,0,0,0-1.292-1.3008l-.3769-.9257a2.0466,2.0466,0,0,1,2.5971,2.5981Z"
          transform="translate(-1055.25 -278.75)"
          fill="#111111"
        ></path>
      </g>
    </g>
  </svg>
);

enum CustomColorType {
  CUSTOM_COLOR_1,
  CUSTOM_COLOR_2,
  CUSTOM_COLOR_3,
}
