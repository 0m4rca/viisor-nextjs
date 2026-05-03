"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BookingStatusClient() {
  const params = useSearchParams();

  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(false); // 👈 para ocultar form

  // 🧠 1. Leer params de URL
  useEffect(() => {
    const urlBookingId = params.get("bookingId") || params.get("booking");

    const urlEmail = params.get("email");

    if (urlBookingId) setBookingId(urlBookingId);
    if (urlEmail) setEmail(urlEmail);

    if (urlBookingId && urlEmail) {
      setAutoMode(true); // 👈 viene de link directo
    }
  }, [params]);

  // 🧠 2. Función para consultar
  async function fetchBooking(id, mail) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/booking-status?bookingId=${encodeURIComponent(
          id,
        )}&email=${encodeURIComponent(mail)}`,
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al consultar la reserva");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  // 🧠 3. Auto-submit si viene de URL
  useEffect(() => {
    if (bookingId && email) {
      fetchBooking(bookingId, email);
    }
  }, [bookingId, email]);

  // 🧠 4. Submit manual
  function handleSubmit(e) {
    e.preventDefault();
    fetchBooking(bookingId, email);
  }

  // 🧠 5. Pagar restante
  async function handlePayRemaining() {
    const res = await fetch("/api/create-remaining-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingId }),
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow">
      {/* 🟢 FORM SOLO SI NO VIENE DE LINK */}
      {!autoMode && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="ID de reserva"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-xl"
            required
          />

          <button className="w-full bg-black text-white py-3 rounded-xl">
            {loading ? "Consultando..." : "Ver estado"}
          </button>
        </form>
      )}

      {/* 🟡 loading */}
      {loading && <p>⏳ Cargando información...</p>}

      {/* 🔴 error */}
      {error && <p className="text-red-600">{error}</p>}

      {/* 🟢 resultado */}
      {result && (
        <div className="p-5 border rounded-xl bg-gray-50 space-y-3">
          <p>
            <strong>Reserva:</strong> {result.booking.id}
          </p>

          <p>
            <strong>Estado:</strong> {result.booking.status}
          </p>

          <p>
            <strong>Total:</strong> {result.booking.total_price} MXN
          </p>

          <p>
            <strong>Pagado:</strong> {result.totalPaid} MXN
          </p>

          <p>
            <strong>Saldo:</strong> {result.remaining} MXN
          </p>

          <hr />

          <p className="font-semibold">Pagos:</p>

          {result.payments.length > 0 ? (
            result.payments.map((p) => (
              <p key={p.id}>
                {p.amount} MXN - {p.status}
              </p>
            ))
          ) : (
            <p>⏳ Confirmando pago...</p>
          )}

          {/* 🔥 BOTÓN PAGO RESTANTE */}
          {result.remaining > 0 && (
            <button
              onClick={handlePayRemaining}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl"
            >
              Pagar restante
            </button>
          )}
        </div>
      )}
    </div>
  );
}
