import Image from "next/image";
import Link from "next/link";

export default function TourCard({ tour }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform">
      <Image
        src={tour.imageUrl}
        alt={tour.name}
        width={400}
        height={300}
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-tertiary">{tour.name}</h2>
        <p className="text-gray-600">{tour.description}</p>
        <p className="mt-2 text-lg font-semibold text-primary">${tour.price}</p>
        <Link
          href={`/booking/${tour.id}`}
          className="inline-block mt-3 text-white bg-primary px-4 py-2 rounded-xl hover:bg-opacity-80"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
