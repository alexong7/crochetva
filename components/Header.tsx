import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bars3Icon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectBasketItems } from "@/redux/basketSlice";
import MobileMenu from "./MobileMenu";
import  Logo2  from "../public/Logo2.png"

function Header() {
  // Track how many items in cart
  const items = useSelector(selectBasketItems);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between bg-[#FFCEEE] p-4 h-[80px] md:h-[100px]">
      {/* Logo */}
      <div className=" flex items-center justify-center md:w-1/5">
        <Link href="/">
          <div className="relative  h-[75px] md:h-[90px]  w-24 cursor-pointer opacity-75 transition hover:opacity-100">
            <Image
              src={Logo2}
              alt=""
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Link>
      </div>

      {/* Cateogries */}
      <div className="hidden flex-1 items-center justify-center space-x-8 md:flex">
        <Link href="/products/all" className="headerLink">
          Products
        </Link>
        <Link href="/about" className="headerLink">
          About
        </Link>
        <Link href="/contact" className="headerLink">
          Contact
        </Link>
        <Link href="/faq" className="headerLink">
          FAQ
        </Link>
      </div>

      {/* Right side Icons */}
      <div className="flex items-center justify-center gap-x-4 md:w-1/5">
        <Link href="/checkout">
          <div className="relative cursor-pointer">
            <span
              className="gradient absolute -right-1 -top-1 z-50 flex h-4 
            w-4 items-center justify-center rounded-full text-[10px] text-white"
            >
              {items.length}
            </span>
            <ShoppingBagIcon className="headerIcon" />
          </div>
        </Link>

   

        <div>
          <Bars3Icon
            className="headerIcon md:hidden"
            onClick={() => setOpen(true)}
          />
          {open && <MobileMenu close={() => setOpen(false)} />}
        </div>
      </div>
    </header>
  );
}

export default Header;

const defaultImage =
  "https://i.pinimg.com/originals/d7/14/54/d714540f9b3fc4127d14f00e3a084e36.png";


