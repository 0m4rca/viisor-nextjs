import ButtonText from "./ButtonText";
import Link from "next/link";

export default function FlipCard({ tour }) {
  return (
    <div className="relative w-80 mx-auto md:h-96 md:[perspective:150rem] group">
      {/* Card Inner */}
      <div
        className="
        relative w-full h-auto 
        transition-transform duration-700
        [transform-style:preserve-3d]
        md:h-full
        group-hover:[transform:rotateY(180deg)]
      "
      >
        {/* Front Side (hidden on mobile) */}
        <div
          className="
          hidden md:block
          absolute top-0 left-0 w-full h-full 
          rounded-xl overflow-hidden shadow-xl 
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

        {/* Back Side (always visible on mobile) */}
        <div
          className="
          relative w-full h-auto rounded-xl overflow-hidden shadow-xl
          bg-gradient-to-br from-blue-400 to-blue-700 text-white
          flex flex-col items-center justify-center
          text-center
          [backface-visibility:hidden]
          md:absolute md:top-0 md:left-0 md:h-full md:[transform:rotateY(180deg)]
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
  );
}
