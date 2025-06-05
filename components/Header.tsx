'use client';

import Link from "next/link";
import Image from "next/image";
import HeaderAuth from "@/components/header-auth";

export function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full glass-header border-b border-gray-200/30 z-50">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center p-3 px-5 text-sm h-16">
        <div className="flex-1" />
        <Link href={"/"} className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/logo.svg"
            alt="GlamSquad"
            width={150}
            height={40}
            priority
          />
        </Link>
        <div className="flex-1 flex justify-end">
          <HeaderAuth />
        </div>
      </div>
    </nav>
  );
}