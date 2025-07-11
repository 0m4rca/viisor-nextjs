"use client";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

export default function HamburgerBtn() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label="Toggle menu"
        aria-expanded={open}
        className="fixed top-4 right-6 z-[2000] w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="relative w-8 h-6">
          {/* Top Line */}
          <span
            className={`absolute left-0 top-1/2 h-[2px] w-full bg-gray-800 origin-center transition-transform duration-500 ease-in-out ${
              open ? "rotate-[135deg] -translate-y-1/2" : "-translate-y-3"
            }`}
          />
          {/* Middle Line */}
          <span
            className={`absolute left-0 top-1/2 h-[2px] w-full bg-gray-800 transition-opacity duration-500 ease-in-out  ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Bottom Line */}
          <span
            className={`absolute left-0 top-1/2 h-[2px] w-full bg-gray-800 origin-center transition-transform duration-500 ease-in-out ${
              open ? "-rotate-[135deg] -translate-y-1/2" : "translate-y-3"
            }`}
          />
        </div>
      </button>
      {/* Expanding Circle Background */}
      <div
        className={`fixed top-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-tertiary rounded-full z-[1000] transition-transform duration-[800ms] ease-in-out ${
          open ? "scale-[80]" : "scale-0"
        }`}
      ></div>
      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}
