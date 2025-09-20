"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { supabase } from "../../../lib/supabaseClient";

export default function DateSelector({
  tourId,
  selectedDate,
  setSelectedDate,
  maxCapacity,
}) {
  const [tourDates, setTourDates] = useState([]); // [{ date, totalBooked, isFull }]

  const parseDateOnly = (value) => {
    if (!value) return null;
    if (value instanceof Date)
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    const dt = new Date(value);
    if (isNaN(dt)) return null;
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching tour_dates for tourId:", tourId);

        const { data: datesData, error: datesError } = await supabase
          .from("tour_dates")
          .select("id, date")
          .eq("tour_id", tourId);

        if (datesError) throw datesError;
        if (!datesData || datesData.length === 0) {
          console.log("No tour dates found.");
          setTourDates([]);
          return;
        }

        const tourDateIds = datesData.map((d) => d.id);

        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("tour_date_id, num_people")
          .in("tour_date_id", tourDateIds);

        if (bookingsError) throw bookingsError;

        console.log("Fetched bookingsData:", bookingsData);

        // Agrupar reservas por fecha
        const bookingsPerDate = {};
        datesData.forEach((d) => {
          const dateObj = parseDateOnly(d.date);
          if (!dateObj) return;
          const key = dateObj.toDateString();

          const totalBookedForThisDate = bookingsData
            .filter((b) => b.tour_date_id === d.id)
            .reduce((sum, b) => sum + (b.num_people || 0), 0);

          bookingsPerDate[key] =
            (bookingsPerDate[key] || 0) + totalBookedForThisDate;
        });

        console.log("Bookings summed per date:", bookingsPerDate);

        // Construir tourDates con isFull
        const parsedDates = Object.entries(bookingsPerDate).map(
          ([dateStr, totalBooked]) => {
            const dateObj = new Date(dateStr);
            const isFull = totalBooked >= maxCapacity;
            console.log(
              `Date ${dateStr} - totalBooked: ${totalBooked}, isFull: ${isFull}`
            );
            return { date: dateObj, totalBooked, isFull };
          }
        );

        setTourDates(parsedDates);
      } catch (error) {
        console.error("Error fetching tour dates or bookings:", error);
      }
    };

    fetchData();
  }, [tourId, maxCapacity]);

  // Fechas llenas y disponibles
  const fullDates = tourDates.filter((d) => d.isFull).map((d) => d.date);
  const availableDates = tourDates.filter((d) => !d.isFull).map((d) => d.date);

  console.log("Available dates:", availableDates);
  console.log("Full dates:", fullDates);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Función para deshabilitar fechas llenas y fechas pasadas
  const disabledDates = (date) => {
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Deshabilitar fechas pasadas
    if (dateOnly < today) return true;

    // Deshabilitar fechas llenas
    return fullDates.some((d) => d.getTime() === dateOnly.getTime());
  };

  const handleSelect = (date) => {
    console.log("User clicked date:", date);
    if (!date) return;

    const selected = tourDates.find(
      (d) => d.date.toDateString() === date.toDateString()
    );

    console.log("Selected date object:", selected);

    if (selected) {
      if (selected.isFull) {
        alert(
          `Sorry — this date (${selected.date.toLocaleDateString()}) is full (${
            selected.totalBooked
          }/${maxCapacity}).`
        );
        return;
      }
      setSelectedDate({ id: null, date: selected.date });
    } else {
      setSelectedDate({ id: null, date });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Choose a date</h2>
      <DayPicker
        mode="single"
        selected={selectedDate?.date}
        onSelect={handleSelect}
        disabled={disabledDates}
        modifiers={{
          available: availableDates,
          full: fullDates,
        }}
        modifiersClassNames={{
          available: "bg-blue-500 text-white rounded",
          full: "bg-red-400 text-gray-200 rounded line-through cursor-not-allowed",
        }}
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
