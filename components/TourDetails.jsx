export default function TourDetails({ tour }) {
  return (
    <ul className="p-6 space-y-4 divide-y divide-gray-200 text-center">
      <li className="pt-2 first:pt-0">{tour.duration} hr tour</li>
      <li className="pt-2">Up to 8 people</li>
      <li className="pt-2">Lunch included</li>
      <li className="pt-2">Boat/Captain/Guide</li>
      <li className="pt-2">Suitable for {tour.difficulty}</li>
    </ul>
  );
}
