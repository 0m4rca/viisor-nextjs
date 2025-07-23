"use client";
import { useState } from "react";
import Image from "next/image";
import HeadingPrimary from "./HeadingPrimary";
import ButtonText from "./ButtonText";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative h-screen w-full overflow-hidden">
      {/* Imagen móvil */}
      <Image
        src="/cover-mobile.JPG"
        alt="Scuba Diving Adventure"
        fill
        priority
        sizes="(max-width: 1279px) 100vw, 0px"
        className="object-cover block 2xl:hidden object-[center_40%]"
      />

      {/* Imagen desktop */}
      <Image
        src="/cover-desktop.JPG"
        alt="Scuba Diving Adventure"
        fill
        priority
        sizes="(min-width: 1280px) 100vw, 0px"
        className="object-cover hidden 2xl:block object-[center_90%]"
      />

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
        <div
          className="
        flex 
        flex-col 
        items-center 
        text-center 
        mt-8
        "
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
      </div>
    </header>
  );
}
