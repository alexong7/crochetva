import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  close: () => void;
};

function MobileMenu({ close }: Props) {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
    window.addEventListener("resize", (e: any) => {
      if (e.target.innerWidth >= 640) {
        close();
      }
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div>
      <div className="fixed inset-0 top-0 z-50 h-screen w-full bg-gray-500 bg-opacity-20 backdrop-blur-[2px]">
        <div className="l-0 fixed inset-0 top-0 p-5">
          <div
            className={`w-full rounded-xl bg-white p-5 ${
              animation ? "scale-100" : "scale-95"
            }`}
          >
            <div className=" flex items-center justify-between">
              <h1 className=" text-xl font-bold uppercase tracking-[8px] underline decoration-[#FFCEEE] underline-offset-4">
                Navigation
              </h1>
              <div className="h-7 w-7 cursor-pointer transition-all hover:scale-110">
                <XMarkIcon onClick={() => close()} />
              </div>
            </div>

            <div className=" mt-5 divide-y divide-[#FFCEEE]">
              <Link href="/products/all" className="mobileLink">
                Products
              </Link>
              <Link href="/about" className="mobileLink">
                About
              </Link>
              <Link href="/contact" className="mobileLink">
                Contact
              </Link>
              <Link href="/faq" className="mobileLink">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
