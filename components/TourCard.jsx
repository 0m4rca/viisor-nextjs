import ButtonText from "./ButtonText";
import Link from "next/link";

export default function FlipCard({ tour }) {
  return (
    <div className="relative w-80 mx-auto group">
      {/* ✅ MOBILE: Show as a static simple card */}
      <div className="block md:hidden rounded-xl overflow-hidden shadow-xl bg-white text-center">
        <img
          src={tour.imageUrl}
          alt={tour.name}
          className="w-full h-48 object-cover object-center"
        />
        <div className="p-4">
          <h2 className="font-bold text-lg">{tour.name}</h2>
          <p className="text-sm mb-2">{tour.short_description}</p>
          <p className="text-xl font-bold mb-4">${tour.price}</p>
          <ButtonText
            href={`/booking/${tour.slug}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Book now
          </ButtonText>
        </div>
      </div>

      {/* ✅ DESKTOP: Flip Card */}
      <div className="hidden md:block relative h-96 [perspective:150rem]">
        {/* Card Inner */}
        <div
          className="
            relative w-full h-full transition-transform duration-700
            [transform-style:preserve-3d]
            group-hover:[transform:rotateY(180deg)]
          "
        >
          {/* Front Side */}
          <div
            className="
              absolute top-0 left-0 w-full h-full
              rounded-xl overflow-hidden shadow-xl bg-white
              [backface-visibility:hidden]
            "
          >
            <img
              src={tour.imageUrl}
              alt={tour.name}
              className="w-full h-2/3 object-cover object-center"
            />
            <div className="p-4 bg-white h-1/3">
              <h2 className="font-bold text-lg">{tour.name}</h2>
              <p className="text-sm">{tour.short_description}</p>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="
              absolute top-0 left-0 w-full h-full
              rounded-xl overflow-hidden shadow-xl
              bg-gradient-to-br from-blue-400 to-blue-700 text-white
              flex flex-col items-center justify-center
              text-center
              [backface-visibility:hidden]
              [transform:rotateY(180deg)]
            "
          >
            <p className="text-3xl font-bold mb-2">${tour.price}</p>
            <ButtonText
              href={`/booking/${tour.slug}`}
              className="bg-white text-blue-800 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100"
            >
              Book now
            </ButtonText>
          </div>
        </div>
      </div>
    </div>
  );
}
