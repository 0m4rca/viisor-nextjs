//GuestForm.jsx//
"use client";

import { useState } from "react";

export default function GuestForm({ tour, selectedDate }) {
  const [loading, setLoading] = useState(false);

  // Cliente principal
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [finSize, setFinSize] = useState("");
  const [bcdSize, setBcdSize] = useState("");
  const [wetsuitSize, setWetsuitSize] = useState("");
  const [certification, setCertification] = useState("");

  // acompañantes
  const [companions, setCompanions] = useState([]);

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

  const handleCompanionChange = (index, field, value) => {
    const updated = [...companions];
    updated[index][field] = value;
    setCompanions(updated);
  };

  /* =========================
     🔥 SOLO STRIPE
  ========================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        tour,
        selectedDate,
        customer: { name, email, phone },
        companions,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.log(data);
      alert(data.error || "Error creando pago");

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow"
    >
      <h2 className="font-bold text-lg">Información del cliente</h2>

      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <button
        type="button"
        onClick={addCompanion}
        className="bg-gray-300 rounded p-2"
      >
        Añadir acompañante
      </button>

      {companions.map((c, i) => (
        <input
          key={i}
          placeholder="Nombre acompañante"
          value={c.name}
          onChange={(e) => handleCompanionChange(i, "name", e.target.value)}
          className="border p-2 rounded"
        />
      ))}

      <button
        disabled={loading}
        className="bg-black text-white p-3 rounded-xl disabled:opacity-50"
      >
        {loading ? "Redirigiendo..." : "Pagar depósito"}
      </button>
    </form>
  );
}
