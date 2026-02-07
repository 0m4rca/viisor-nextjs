"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { supabase } from "../../lib/supabaseClient";

// =========================================
// DateSelector Component
// =========================================
export default function DateSelector({
  tourId,
  selectedDate,
  setSelectedDate,
  maxCapacity,
}) {
  // ---------------------------
  // 1️⃣ Estado local
  // ---------------------------
  // Guardamos todas las fechas del tour con info de reservas
  const [tourDates, setTourDates] = useState([]);
  // tourDates = [{ date: Date, totalBooked: number, isFull: boolean }]

  // ---------------------------
  // 2️⃣ Función para limpiar hora
  // ---------------------------
  // Solo queremos comparar fechas (día/mes/año)
  const parseDateOnly = (value) => {
    if (!value) return null;
    const dt = new Date(value);
    if (isNaN(dt)) return null;
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  // ---------------------------
  // 3️⃣ useEffect para traer datos
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ----- 3a. Traer fechas del tour -----
        const { data: datesData, error: datesError } = await supabase
          .from("tour_dates")
          .select("id, date")
          .eq("tour_id", tourId);

        if (datesError) throw datesError;
        if (!datesData) return setTourDates([]);

        const tourDateIds = datesData.map((d) => d.id);

        // ----- 3b. Traer reservas asociadas -----
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("tour_date_id, num_people")
          .in("tour_date_id", tourDateIds);

        if (bookingsError) throw bookingsError;

        // ----- 3c. Sumar reservas por fecha -----
        const bookingsPerDate = {}; // { "Mon Feb 06 2026": totalBooked }
        datesData.forEach((d) => {
          const dateObj = parseDateOnly(d.date);
          if (!dateObj) return;

          const key = dateObj.toDateString(); // clave de fecha sin hora
          const totalBookedForThisDate = bookingsData
            .filter((b) => b.tour_date_id === d.id)
            .reduce((sum, b) => sum + (b.num_people || 0), 0);

          bookingsPerDate[key] =
            (bookingsPerDate[key] || 0) + totalBookedForThisDate;
        });

        // ----- 3d. Construir tourDates con flag de isFull -----
        const parsedDates = Object.entries(bookingsPerDate).map(
          ([dateStr, totalBooked]) => {
            const dateObj = new Date(dateStr);
            return {
              date: dateObj,
              totalBooked,
              isFull: totalBooked >= maxCapacity,
            };
          },
        );

        setTourDates(parsedDates);
      } catch (error) {
        console.error("Error fetching tour dates or bookings:", error);
      }
    };

    fetchData();
  }, [tourId, maxCapacity]);

  // ---------------------------
  // 4️⃣ Fechas llenas
  // ---------------------------
  const fullDates = tourDates.filter((d) => d.isFull).map((d) => d.date);

  // ---------------------------
  // 5️⃣ Fecha actual
  // ---------------------------
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignorar hora para comparaciones

  // ---------------------------
  // 6️⃣ Función para deshabilitar fechas
  // ---------------------------
  const disabledDates = (date) => {
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    // ❌ Deshabilitar fechas pasadas
    if (dateOnly < today) return true;

    // ❌ Deshabilitar fechas llenas
    return fullDates.some((d) => d.getTime() === dateOnly.getTime());
  };

  // ---------------------------
  // 7️⃣ Manejar selección de fecha
  // ---------------------------
  const handleSelect = (date) => {
    if (!date) return;

    // Buscar info de la fecha seleccionada
    const selected = tourDates.find(
      (d) => d.date.toDateString() === date.toDateString(),
    );

    // ❌ Si la fecha está llena, mostrar alerta
    if (selected && selected.isFull) {
      alert(
        `Lo sentimos, esta fecha está llena (${selected.totalBooked}/${maxCapacity})`,
      );
      return;
    }

    // ✅ Guardar fecha seleccionada
    setSelectedDate(
      selected ? { id: null, date: selected.date } : { id: null, date },
    );
  };

  // ---------------------------
  // 8️⃣ Renderizado
  // ---------------------------
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Elige una fecha</h2>

      {/* Calendario */}
      <DayPicker
        mode="single"
        selected={selectedDate?.date}
        onSelect={handleSelect}
        disabled={disabledDates}
        modifiersClassNames={{
          selected: "bg-primary text-white rounded",
          disabled: "bg-gray-200 text-gray-500 line-through",
        }}
      />

      {/* Leyenda de fecha seleccionada */}
      {selectedDate?.date && (
        <p className="mt-2">
          Fecha seleccionada:{" "}
          {selectedDate.date.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
