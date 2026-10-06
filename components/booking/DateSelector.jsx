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
  // Guardamos las salidas publicadas del tour y su ocupación
  const [tourDates, setTourDates] = useState([]);
  // tourDates = [{ id, date: Date, totalBooked, isFull }]

  // ---------------------------
  // 2️⃣ Función para limpiar hora
  // ---------------------------
  // Solo queremos comparar fechas (día/mes/año)
  const parseDateOnly = (value) => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
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
        let bookingsData = [];
        if (tourDateIds.length > 0) {
          const { data, error: bookingsError } = await supabase
            .from("bookings")
            .select("tour_date_id, num_people")
            .in("tour_date_id", tourDateIds)
            .in("status", ["pending", "confirmed", "fully paid", "paid"]);

          if (bookingsError) throw bookingsError;
          bookingsData = data || [];
        }

        const reservedByDateId = new Map();
        for (const booking of bookingsData) {
          const currentTotal = reservedByDateId.get(booking.tour_date_id) || 0;
          reservedByDateId.set(
            booking.tour_date_id,
            currentTotal + Number(booking.num_people || 0),
          );
        }

        const parsedDates = datesData
          .map((dateRow) => {
            const date = parseDateOnly(dateRow.date);
            const totalBooked = reservedByDateId.get(dateRow.id) || 0;

            return {
              id: dateRow.id,
              date,
              totalBooked,
              isFull: totalBooked >= maxCapacity,
            };
          })
          .filter((dateRow) => dateRow.date);

        setTourDates(parsedDates);
      } catch (error) {
        console.error("Error fetching tour dates or bookings:", error);
      }
    };

    fetchData();
  }, [tourId, maxCapacity]);

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

    const scheduledDate = tourDates.find(
      (item) => item.date.getTime() === dateOnly.getTime(),
    );

    return !scheduledDate || scheduledDate.isFull;
  };

  const isAvailableDate = (date) => !disabledDates(date);

  // ---------------------------
  // 7️⃣ Manejar selección de fecha
  // ---------------------------
  const handleSelect = (date) => {
    if (!date) return;

    // Buscar info de la fecha seleccionada
    const selected = tourDates.find(
      (item) => item.date.getTime() === date.getTime(),
    );

    if (!selected) return;

    // ❌ Si la fecha está llena, mostrar alerta
    if (selected.isFull) {
      alert(
        `Lo sentimos, esta fecha está llena (${selected.totalBooked}/${maxCapacity})`,
      );
      return;
    }

    // ✅ Guardar fecha seleccionada
    setSelectedDate({ id: selected.id, date: selected.date });
  };

  // ---------------------------
  // 8️⃣ Renderizado
  // ---------------------------
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Elige una fecha</h2>

      {/* Calendario */}
      <DayPicker
        className="booking-calendar"
        mode="single"
        selected={selectedDate?.date}
        onSelect={handleSelect}
        disabled={disabledDates}
        modifiers={{ available: isAvailableDate }}
        modifiersClassNames={{
          available: "booking-date-available",
          selected: "booking-date-selected",
          disabled: "booking-date-disabled",
          today: "booking-date-today",
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
