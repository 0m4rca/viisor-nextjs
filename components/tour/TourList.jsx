"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import TourCard from "./TourCard";

export default function TourList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTours() {
      const { data, error } = await supabase.from("tours").select("*");

      if (error) {
        console.error("Error fetching tours:", error.message);
      } else {
        const formatted = data.map((tour) => ({
          ...tour,
          imageUrl: tour.image_url,
        }));
        setTours(formatted);
      }

      setLoading(false);
    }

    fetchTours();
  }, []);

  if (loading) return <p>Loading tours...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
