"use client";
import { useState } from "react";

export default function GuestForm({ tour, selectedDate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora, solo hacemos console.log
    console.log({
      tourId: tour.id,
      dateId: selectedDate,
      name,
      email,
      phone,
    });
    alert("Datos recibidos (próximamente se guardarán en Supabase)");
  };

  return (
    <form
      className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4">Tus datos</h2>

      <input
        type="text"
        placeholder="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />

      <input
        type="tel"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="px-4 py-2 border rounded-lg"
        required
      />

      <button
        type="submit"
        className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
      >
        Continuar
      </button>
    </form>
  );
}
