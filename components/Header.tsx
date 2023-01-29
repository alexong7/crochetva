import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBagIcon, UserIcon } from "@heroicons/react/24/outline";

function Header() {
  const session = false;

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between bg-[#FFCEEE] p-4">
      {/* Logo */}
      <div className="flex items-center justify-center md:w-1/5">
        <Link href="/">
          <div className="relative h-12 w-10 cursor-pointer opacity-75 transition hover:opacity-100">
            <Image
              src={defaultImage}
              alt="Image not found"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Link>
      </div>

      {/* Cateogries */}
      <div className="hidden flex-1 items-center justify-center space-x-8 md:flex">
        <a className="headerLink">Products</a>
        <a className="headerLink">About</a>
        <a className="headerLink">Contact</a>
      </div>

      {/* Right side Icons */}
      <div className="flex items-center justify-center gap-x-4 md:w-1/5">
        <Link href="/checkout">
          <div className="relative cursor-pointer">
            <span
              className="absolute -right-1 -top-1 z-50 flex h-4 w-4 
            items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-[10px] text-white"
            >
              5
            </span>
            <ShoppingBagIcon className="headerIcon" />
          </div>
        </Link>

        {session ? (
          <Image
            src={defaultUserIcon}
            alt=""
            className="cursor-pointer rounded-full"
            width={34}
            height={34}
          />
        ) : (
          <UserIcon className="headerIcon" />
        )}
      </div>
    </header>
  );
}

export default Header;

const defaultImage =
  "https://i.pinimg.com/originals/d7/14/54/d714540f9b3fc4127d14f00e3a084e36.png";

const defaultUserIcon =
  "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png";
