"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const bookingId = params.get("booking");
  const email = params.get("email");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    if (!bookingId) return;

    try {
      const res = await fetch(
        `/api/booking-status?bookingId=${bookingId}&email=${email || ""}`,
      );

      const json = await res.json();

      if (res.ok) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!bookingId) return;
    fetchData();
  }, [bookingId]);

  async function handlePayRemaining() {
    const res = await fetch("/api/create-remaining-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });

    const json = await res.json();
    window.location.href = json.url;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <p>No se encontró información de la reserva.</p>
        </div>
      </div>
    );
  }

  const { booking, payments, totalPaid, remaining } = data;

  return (
    <main className="max-w-2xl mx-auto py-20 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago confirmado!
          </h1>
          <p className="text-gray-600">
            Tu reserva ha sido confirmada exitosamente.
          </p>
        </div>

        {/* Booking Info */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Detalles de la reserva</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">ID de reserva</p>
              <p className="font-medium">{booking.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Estado</p>
              <p className="font-medium capitalize">{booking.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-medium">{booking.total_price} MXN</p>
            </div>
            <div>
              <p className="text-gray-600">Pagado</p>
              <p className="font-medium">{totalPaid} MXN</p>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div>
          <h3 className="font-semibold mb-2">Pagos</h3>

          <div className="space-y-2">
            {payments.length > 0 ? (
              payments.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between bg-gray-100 p-3 rounded-lg text-sm"
                >
                  <span>{p.status}</span>
                  <span className="font-medium">{p.amount} MXN</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">⏳ Confirmando pago...</p>
            )}
          </div>
        </div>

        {/* Botón */}
        {remaining > 0 && (
          <button
            onClick={handlePayRemaining}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Pagar restante
          </button>
        )}

        {/* Link */}
        <div className="text-sm text-gray-600 space-y-2">
          <p>Guarda este link:</p>

          <input
            readOnly
            className="w-full border rounded-lg p-2 text-xs bg-gray-50"
            value={`${window.location.origin}/booking/status?bookingId=${
              booking.id
            }${email ? `&email=${email}` : ""}`}
          />
        </div>
      </div>
    </main>
  );
}
