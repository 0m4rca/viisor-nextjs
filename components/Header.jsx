"use client";
import { useState } from "react";
import Image from "next/image";
import Navigation from "./Navigation";
import HeadingPrimary from "./HeadingPrimary";
import ButtonText from "./ButtonText";

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
        <ButtonText
          href="/Tours"
          className=" bg-[var(--color-secondary-dark)] text-gray-700
        "
        >
          Discover our tours
        </ButtonText>
      </div>
    </header>
  );
}
