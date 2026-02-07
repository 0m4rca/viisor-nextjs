"use client";

import { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingHero({ tour }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  return (
    <>
      {/* CAROUSEL */}
      <div className="relative mb-8">
        <div
          ref={sliderRef}
          className="keen-slider rounded-2xl w-full overflow-hidden shadow-lg"
        >
          {tour.images?.map((img, i) => (
            <div
              key={i}
              className="keen-slider__slide relative h-[400px] md:h-[550px]"
            >
              <Image
                src={img}
                alt={tour.name}
                fill
                className="object-cover rounded-2xl"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {slider && (
          <>
            <button
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
              onClick={() => slider.current?.prev()}
            >
              <ChevronLeft />
            </button>

            <button
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
              onClick={() => slider.current?.next()}
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {/* TITLE */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-tertiary mb-2">{tour.name}</h1>
        <p className="text-2xl font-semibold text-primary">${tour.price}</p>
      </div>
    </>
  );
}
