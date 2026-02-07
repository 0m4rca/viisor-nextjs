import { Clock, Users, MapPin, Star } from "lucide-react";
import Info from "./Info";

export default function TourInfo({ tour }) {
  return (
    <>
      {/* QUICK FACTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Info icon={<Clock />} text={tour.duration} />
        <Info icon={<Users />} text={`Max ${tour.max_capacity} pax`} />
        <Info icon={<MapPin />} text={tour.location} />
        <Info icon={<Star />} text={`${tour.rating} ★`} />
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-700 leading-relaxed mb-8 text-justify">
        {tour.long_description}
      </p>
    </>
  );
}
