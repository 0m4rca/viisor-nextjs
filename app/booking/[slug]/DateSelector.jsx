"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateSelector({
  tourId,
  selectedDate,
  setSelectedDate,
}) {
  const [availableDates, setAvailableDates] = useState([]);

  // Por ahora, ejemplo de fechas disponibles, luego conectamos Supabase
  useEffect(() => {
    const exampleDates = [
      new Date("2025-09-20"),
      new Date("2025-09-22"),
      new Date("2025-09-25"),
      new Date("2025-10-02"),
      new Date("2025-10-08"),
      new Date("2025-10-15"),
    ];
    setAvailableDates(exampleDates);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Choose a date</h2>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={{ before: new Date(), outside: availableDates }}
        modifiers={{
          available: availableDates,
        }}
        modifiersClassNames={{
          available: "bg-blue-500 text-white rounded",
        }}
      />
      {selectedDate && (
        <p className="mt-2">
          Fecha seleccionada: {selectedDate.toLocaleDateString("es-MX")}
        </p>
      )}
    </div>
  );
}
