"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

import BookingHero from "../../../components/booking/BookingHero";
import TourInfo from "../../../components/booking/TourInfo";
import BookingFlow from "../../../components/booking/BookingFlow";

export default function BookingPageClient({ slug }) {
  const [tour, setTour] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
  });

  // 🔥 traer tour en cliente (correcto para supabase js)
  useEffect(() => {
    async function fetchTour() {
      const { data } = await supabase
        .from("tours")
        .select("*")
        .eq("slug", slug)
        .single();

      setTour(data);
    }

    fetchTour();
  }, [slug]);

  if (!tour) return <p>Loading...</p>;

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
