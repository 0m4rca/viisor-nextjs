"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import HeadingPrimary from "./HeadingPrimary";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative h-screen w-full overflow-hidden">
      <Image
        src="/cover.jpg"
        alt="Scuba Diving Adventure"
        fill
        priority
        className="object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
        <HeadingPrimary
          main="Dive with VIISOR"
          sub="Witness Baja California Sur"
        />
        <Link
          href="/booking"
          className="bg-primary hover:bg-opacity-90 text-white text-lg font-medium px-6 py-3 rounded-full transition"
        >
          Book Now
        </Link>
      </div>

      <Navigation />
    </header>
  );
}
