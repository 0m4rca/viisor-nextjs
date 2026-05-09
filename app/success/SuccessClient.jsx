"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();

  const bookingId = params.get("booking");
  const email = params.get("email");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function fetchData() {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/booking-status?bookingId=${bookingId}&email=${email || ""}`,
      );

      if (!res.ok) {
        throw new Error("Error fetching booking");
      }

      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [bookingId]);

  async function handlePayRemaining() {
    try {
      const res = await fetch("/api/create-remaining-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) {
        throw new Error("Error creating payment session");
      }

      const json = await res.json();

      window.location.href = json.url;
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar el pago.");
    }
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

  if (!data?.booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <p>No se encontró la reserva.</p>
        </div>
      </div>
    );
  }

  const { booking, payments, totalPaid, remaining } = data;

  const bookingLink = `${origin}/booking/status?bookingId=${
    booking.id
  }${email ? `&email=${email}` : ""}`;

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-16 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
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

          <h1 className="text-3xl font-bold text-green-600">✅ Pago exitoso</h1>

          <p className="text-gray-500 mt-2">Tu reserva está registrada</p>
        </div>

        {/* Info */}
        <div className="grid gap-3 text-sm bg-gray-50 p-5 rounded-xl">
          <p>
            <strong>ID:</strong> {booking.id}
          </p>

          <p>
            <strong>Status:</strong> {booking.status}
          </p>

          <p>
            <strong>Total:</strong> {booking.total_price} MXN
          </p>

          <p>
            <strong>Pagado:</strong> {totalPaid} MXN
          </p>

          <p className="font-semibold text-black">Restante: {remaining} MXN</p>
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

        {/* Remaining Payment */}
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
            value={bookingLink}
          />
        </div>
      </div>
    </main>
  );
}
