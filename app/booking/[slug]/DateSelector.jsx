"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { supabase } from "../../../lib/supabaseClient";

export default function DateSelector({
  tourId,
  selectedDate,
  setSelectedDate,
}) {
  const [tourDates, setTourDates] = useState([]); // guardamos {id, date}

  useEffect(() => {
    const fetchDates = async () => {
      const { data, error } = await supabase
        .from("tour_dates")
        .select("id, date")
        .eq("tour_id", tourId);

      if (error) {
        console.error("Error fetching dates:", error);
        return;
      }

      if (!data || data.length === 0) {
        // No hay fechas en BD: permitimos cualquier fecha futura
        setTourDates([]);
      } else {
        const parsedDates = data
          .map((d) => {
            const dateObj = new Date(d.date);
            if (isNaN(dateObj)) return null; // ignoramos fechas inválidas
            return { id: d.id, date: dateObj };
          })
          .filter(Boolean);
        setTourDates(parsedDates);
      }
    };

    fetchDates();
  }, [tourId]);

  // Solo fechas para DayPicker
  const availableDates = tourDates.map((d) => d.date);

  const handleSelect = (date) => {
    if (!date) return;

    // Buscamos la fecha en tourDates
    const selected = tourDates.find(
      (d) => d.date.toDateString() === date.toDateString()
    );

    // Si no existe, devolvemos un objeto con id null
    setSelectedDate(selected || { id: null, date });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Choose a date</h2>
      <DayPicker
        mode="single"
        selected={selectedDate?.date || null}
        onSelect={handleSelect}
        disabled={
          availableDates.length > 0
            ? { before: new Date(), outside: availableDates }
            : { before: new Date() }
        }
        modifiers={{ available: availableDates }}
        modifiersClassNames={{ available: "bg-blue-500 text-white rounded" }}
      />
      {selectedDate?.date && (
        <p className="mt-2">
          Selected date:{" "}
          {selectedDate.date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
