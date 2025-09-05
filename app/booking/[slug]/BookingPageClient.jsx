"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function BookingPageClient({ tour }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  if (!tour?.images?.length) {
    return <p>No hay imágenes disponibles</p>;
  }

  return (
    <div className="max-w-5xl  mx-auto mb-10 py-32 px-4">
      {/* 🔹 Hero Carousel */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="keen-slider rounded-2xl w-full overflow-hidden shadow-lg"
        >
          {tour.images.map((img, i) => (
            <div
              key={i}
              className="keen-slider__slide relative h-[400px] md:h-[550px]"
            >
              <Image
                src={img}
                alt={tour.name}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {slider && (
          <>
            <button
              className="absolute top-1/2 left-2 -translate-y-1/2 ..."
              onClick={() => slider.current?.prev()}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              className="absolute top-1/2 right-2 -translate-y-1/2 ..."
              onClick={() => slider.current?.next()}
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* 🔹 Dots */}
        {slider && (
          <div className="flex justify-center mt-3 space-x-2">
            {tour.images.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === idx ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => slider.moveToIdx(idx)}
              ></button>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Title & Price */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-tertiary mb-2">{tour.name}</h1>
        <p className="text-2xl font-semibold text-primary">${tour.price}</p>
      </div>

      {/* 🔹 Quick Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl">
          <Clock className="text-primary mb-2" />
          <p>{tour.duration}</p>
        </div>
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl">
          <Users className="text-primary mb-2" />
          <p>Max {tour.max_capacity} pax</p>
        </div>
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl">
          <MapPin className="text-primary mb-2" />
          <p>{tour.location}</p>
        </div>
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl">
          <Star className="text-primary mb-2" />
          <p>{tour.rating} ★</p>
        </div>
      </div>

      {/* 🔹 Description */}
      <p className="text-gray-700 leading-relaxed mb-8 text-justify">
        {tour.long_description}
      </p>

      {/* 🔹 Itinerary */}
      {tour.itinerary?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-tertiary">Itinerary</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {tour.itinerary.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Inclusions / Exclusions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {tour.included?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-tertiary">Included</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {tour.included.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {tour.not_included?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-tertiary">
              Not included
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {tour.not_included.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 🔹 Reviews */}
      {tour.reviews?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-3 text-tertiary">
            Customer Reviews
          </h2>
          <div className="space-y-4">
            {tour.reviews.map((review, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <p className="text-gray-700 italic">"{review.comment}"</p>
                <p className="mt-2 font-semibold">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 CTA */}
      <div className="flex justify-center">
        <button className="bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-opacity-90 transition">
          Book Now
        </button>
      </div>
    </div>
  );
}
