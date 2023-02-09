import { CheckIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

function Success({}: Props) {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <div>
      <Head>
        <title> Thank You! - Crochetva</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mx-auto max-w-xl">
        <Link href="/">
          <div className="relative ml-4 h-24 w-12 cursor-pointer transition lg:hidden">
            <Image
              src={defaultImage}
              layout="fill"
              objectFit="contain"
              alt=""
            />
          </div>
        </Link>
      </header>

      <main className="">
        <section className="order-2 mx-auto max-w-xl pb-12 lg:mx-0 lg:max-w-none lg:pr-16 lg:pt-16 xl:pl-16 2xl:pl-44">
          <Link href="/">
            <div className="relative  hidden h-40 w-20 cursor-pointer transition lg:inline-flex">
              <Image
                src={defaultImage}
                layout="fill"
                objectFit="contain"
                alt=""
              />
            </div>
          </Link>

          <div className="my-8 ml-4 flex space-x-4 lg:ml-14 xl:ml-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black">
              <CheckIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Order #{session_id?.slice(-5)}
              </p>
              <h4 className="text-lg">
                Thank you{" "}
                {/* {session ? session_id.user?.name?.split(" ")[0] : "Guest"} */}
              </h4>
            </div>
          </div>

          <div className="mx-4 divide-y divide-gray-300 rounded-md border border-gray-300 p-4 lg:ml-14">
            <div className="space-y-2 pb-3">
              <p>Your order is confirmed</p>
              <p className="text-sm text-gray-600">
                We&apos;ve accepted your order, and we&apos;re getting it ready.
                Come back to this page for updates on your shipment status.
              </p>
            </div>
            <div className="pt-3 text-sm">
              <p className="font-medium text-gray-600">
                Order Tracking Number:
              </p>
              <p>CJDLF19284</p>
            </div>
          </div>

          <div className="my-4 mx-4 space-y-2 rounded-md border border-gray-300 p-4 lg:ml-14">
            <p>Order updates</p>
            <p className="text-sm text-gray-600">
              You&apos;ll get shipping and delivery updates by email and text.
            </p>
          </div>

          <div>
            <p className="hidden lg:inline">Need help? Contact us</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Success;

const defaultImage =
  "https://i.pinimg.com/originals/d7/14/54/d714540f9b3fc4127d14f00e3a084e36.png";
