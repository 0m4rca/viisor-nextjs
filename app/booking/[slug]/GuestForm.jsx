"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function GuestForm({ tour, selectedDate }) {
  // Cliente principal
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [finSize, setFinSize] = useState("");
  const [bcdSize, setBcdSize] = useState("");
  const [wetsuitSize, setWetsuitSize] = useState("");
  const [certification, setCertification] = useState("");

  // Acompañantes
  const [companions, setCompanions] = useState([]);

  const handleCompanionChange = (index, field, value) => {
    const updated = [...companions];
    updated[index][field] = value;
    setCompanions(updated);
  };

  const addCompanion = () => {
    setCompanions([
      ...companions,
      {
        name: "",
        fin_size: "",
        bcd_size: "",
        wetsuit_size: "",
        certification: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Buscar o crear guest principal
      let guestData;
      const { data: existingGuest } = await supabase
        .from("guests")
        .select("*")
        .eq("email", email)
        .single();

      if (existingGuest) {
        guestData = existingGuest;
      } else {
        const { data, error: guestError } = await supabase
          .from("guests")
          .insert([{ name, email, phone }])
          .select()
          .single();
        if (guestError) throw guestError;
        guestData = data;
      }

      // 2️⃣ Crear tour_date si no existe
      let tourDateId;
      if (!selectedDate.id) {
        const dateObj =
          selectedDate.date instanceof Date
            ? selectedDate.date
            : new Date(selectedDate.date);
        if (isNaN(dateObj)) throw new Error("Selected date is not valid");

        const dateString = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD

        const { data: newDate, error: dateError } = await supabase
          .from("tour_dates")
          .insert([{ tour_id: tour.id, date: dateString }])
          .select()
          .single();
        if (dateError) throw dateError;
        tourDateId = newDate.id;
      } else {
        tourDateId = selectedDate.id;
      }

      // 3️⃣ Crear booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            guest_id: guestData.id,
            tour_date_id: tourDateId,
            num_people: companions.length + 1,
          },
        ])
        .select()
        .single();
      if (bookingError) throw bookingError;

      // 4️⃣ Crear booking_guests
      const bookingGuestsRows = [
        {
          booking_id: bookingData.id,
          guest_id: guestData.id,
          name,
          fin_size: finSize,
          bcd_size: tour.type === "SCUBA" ? bcdSize : null,
          wetsuit_size: wetsuitSize,
          certification,
        },
        ...companions.map((c) => ({
          booking_id: bookingData.id,
          name: c.name,
          fin_size: c.fin_size,
          bcd_size: tour.type === "SCUBA" ? c.bcd_size : null,
          wetsuit_size: c.wetsuit_size,
          certification: c.certification,
        })),
      ];

      const { error: bookingGuestsError } = await supabase
        .from("booking_guests")
        .insert(bookingGuestsRows);
      if (bookingGuestsError) throw bookingGuestsError;

      alert("Booking created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating booking: " + error.message);
    }
  };

  return (
    <form
      className="flex flex-col gap-6 bg-gray-50 p-6 rounded-xl shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4">Client Information</h2>
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />

      <h3 className="text-lg font-semibold">Sizes</h3>
      <input
        type="text"
        placeholder="Fin size"
        value={finSize}
        onChange={(e) => setFinSize(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />
      {tour.type === "SCUBA" && (
        <input
          type="text"
          placeholder="BCD size"
          value={bcdSize}
          onChange={(e) => setBcdSize(e.target.value)}
          className="px-4 py-2 border rounded-lg"
          required
        />
      )}
      <input
        type="text"
        placeholder="Wetsuit size"
        value={wetsuitSize}
        onChange={(e) => setWetsuitSize(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        placeholder="Certification"
        value={certification}
        onChange={(e) => setCertification(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      />

      <h2 className="text-xl font-bold mb-4 mt-4">Companions</h2>
      {companions.map((comp, index) => (
        <div key={index} className="flex flex-col gap-2 border p-4 rounded-lg">
          <input
            type="text"
            placeholder="Name"
            value={comp.name}
            onChange={(e) =>
              handleCompanionChange(index, "name", e.target.value)
            }
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Fin size"
            value={comp.fin_size}
            onChange={(e) =>
              handleCompanionChange(index, "fin_size", e.target.value)
            }
            className="px-4 py-2 border rounded-lg"
            required
          />
          {tour.type === "SCUBA" && (
            <input
              type="text"
              placeholder="BCD size"
              value={comp.bcd_size}
              onChange={(e) =>
                handleCompanionChange(index, "bcd_size", e.target.value)
              }
              className="px-4 py-2 border rounded-lg"
              required
            />
          )}
          <input
            type="text"
            placeholder="Wetsuit size"
            value={comp.wetsuit_size}
            onChange={(e) =>
              handleCompanionChange(index, "wetsuit_size", e.target.value)
            }
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Certification"
            value={comp.certification}
            onChange={(e) =>
              handleCompanionChange(index, "certification", e.target.value)
            }
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addCompanion}
        className="bg-gray-300 text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition"
      >
        Add Companion
      </button>

      <button
        type="submit"
        className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition mt-4"
      >
        Create Booking
      </button>
    </form>
  );
}
