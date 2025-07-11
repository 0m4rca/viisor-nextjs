"use client"; // only if you're using the App Router

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TourCard from "./TourCard";

export default function TourList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTours() {
      const { data, error } = await supabase
        .from("tours") // 👈 make sure this matches your table name
        .select("*"); // You can also specify: 'id, name, description, price, image_url'

      if (error) {
        console.error("Error fetching tours:", error.message);
      } else {
        // If your DB column is image_url, and your component expects imageUrl:
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
