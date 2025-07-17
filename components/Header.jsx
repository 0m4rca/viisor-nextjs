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
      <div className="relative h-screen w-full overflow-hidden">
        {/* Imagen móvil */}
        <Image
          src="/cover-mobile.JPG"
          alt="Scuba Diving Adventure"
          fill
          priority
          className="object-cover block md:hidden"
        />

        {/* Imagen desktop */}
        <Image
          src="/cover-desktop.JPG"
          alt="Scuba Diving Adventure"
          fill
          priority
          className="object-cover hidden md:block object-[center_90%]"
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div
        className="
      absolute 
      inset-0 z-20 
      flex flex-col items-center justify-center 
      text-white text-center 
      px-6 translate-y-20
      gap-2 md:gap-4"
      >
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
