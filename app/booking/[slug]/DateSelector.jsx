"use client";

import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateSelector({
  tourId,
  selectedDate,
  setSelectedDate,
}) {
  const [availableDates, setAvailableDates] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      const { data, error } = await SupabaseAuthClient.from("tour_dates")
        .select("date")
        .eq("tour_id", tourId);

      if (error) {
        console.error("Error fetching dates:", error);
        return;
      }

      if (data.length === 0) {
        // 👉 No hay fechas en la BD: todas futuras son posibles
        setAvailableDates(null);
      } else {
        const parsedDates = data.map((d) => new Date(d.date));
        setAvailableDates(parsedDates);
      }
    };

    fetchDates();
  }, [tourId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Choose a date</h2>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={
          availableDates
            ? { before: new Date(), outside: availableDates }
            : { before: new Date() } // 👈 solo bloquea días pasados si no hay fechas
        }
        modifiers={{
          available: availableDates || [],
        }}
        modifiersClassNames={{
          available: "bg-blue-500 text-white rounded",
        }}
      />
      {selectedDate && (
        <p className="mt-2">
          Selected date:{" "}
          {selectedDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long", // 👈 full month name
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
