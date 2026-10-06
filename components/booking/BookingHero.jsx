"use client";

import { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import HeadingSecondary from "../common/HeadingSecondary";

export default function BookingHero({ tour }) {
  const images =
    Array.isArray(tour.images) && tour.images.length > 0
      ? tour.images
      : tour.image_url
        ? [tour.image_url]
        : [];
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider({
    loop: images.length > 1,
    slides: { perView: 1 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  return (
    <>
      <section className="mb-7" aria-label={`Galería de ${tour.name}`}>
        {images.length > 0 ? (
          <div className="w-full">
            <div
              ref={sliderRef}
              className="keen-slider aspect-[16/10] w-full overflow-hidden bg-gray-200 sm:aspect-[2/1] lg:aspect-[2.5/1]"
            >
              {images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="keen-slider__slide relative h-full"
                >
                  <Image
                    src={image}
                    alt={`${tour.name}, foto ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <div
                className="flex justify-center gap-2.5 py-4"
                aria-label="Elegir foto"
              >
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => slider.current?.moveToIdx(index)}
                    aria-label={`Ver foto ${index + 1} de ${images.length}`}
                    aria-current={currentSlide === index ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                      currentSlide === index
                        ? "w-7 bg-primary-dark"
                        : "w-2.5 bg-gray-400 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-gray-200 text-gray-600 sm:aspect-[2/1] lg:aspect-[2.5/1]">
            Fotos próximamente
          </div>
        )}
      </section>

      <div className="mx-auto mb-6 max-w-5xl px-4 text-center">
        <HeadingSecondary className="mb-2 text-3xl font-bold text-tertiary">
          {tour.name}
        </HeadingSecondary>
        <p className="text-2xl font-semibold text-primary">
          ${Number(tour.price).toLocaleString("es-MX")}
        </p>
      </div>
    </>
  );
}
