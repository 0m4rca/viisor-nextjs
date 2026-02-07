"use client";

import { useState } from "react";
import BookingHero from "../../../components/booking/BookingHero";
import TourInfo from "../../../components/booking/TourInfo";
import BookingFlow from "../../../components/booking/BookingFlow";

export default function BookingPageClient({ tour }) {
  if (!tour) return <p>Tour not found</p>;

  // Hooks para flujo de booking
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
  });

  return (
    <div className="max-w-5xl mx-auto mb-10 py-32 px-4">
      <BookingHero tour={tour} />
      <TourInfo tour={tour} />

      <BookingFlow
        tour={tour}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        guests={guests}
        setGuests={setGuests}
        customer={customer}
        setCustomer={setCustomer}
      />
    </div>
  );
}
