"use client";

import DateSelector from "./DateSelector";
import GuestForm from "./GuestForm";

export default function BookingFlow({ tour, selectedDate, setSelectedDate }) {
  return (
    <div className="space-y-8">
      {/* Selector de fecha */}
      <DateSelector
        tourId={tour.id}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        maxCapacity={tour.max_capacity}
      />

      {/* Formulario de clientes */}
      {selectedDate && <GuestForm tour={tour} selectedDate={selectedDate} />}
    </div>
  );
}
