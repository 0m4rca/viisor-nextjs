"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useTourAvailability(tourId, date) {
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    if (!tourId || !date) return;

    async function check() {
      // capacidad máxima del tour
      const { data: tour } = await supabase
        .from("tours")
        .select("max_capacity")
        .eq("id", tourId)
        .single();

      // reservas existentes
      const { data: bookings } = await supabase
        .from("bookings")
        .select("num_people")
        .eq("tour_date_id", date.id)
        .in("status", ["pending", "confirmed", "paid"]);

      const reserved = bookings?.reduce((sum, b) => sum + b.num_people, 0) || 0;

      const spotsLeft = tour.max_capacity - reserved;

      setAvailability({
        spotsLeft,
        available: spotsLeft > 0,
      });
    }

    check();
  }, [tourId, date]);

  return availability;
}
