"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function BookingStatusClient() {
  const params = useSearchParams();
  const router = useRouter();
  const bookingId = params.get("bookingId") || params.get("booking");
  const token = params.get("token");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!bookingId || !token) {
      setError(
        "Abre el enlace privado que recibiste para consultar esta reserva.",
      );
      setLoading(false);
      return;
    }

    async function fetchBooking() {
      try {
        const query = new URLSearchParams({ bookingId, token });
        const response = await fetch(`/api/booking-status?${query}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo consultar la reserva.");
        }

        setResult(data);
      } catch (fetchError) {
        setError(fetchError.message || "Error de conexión.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId, token]);

  async function handlePayRemaining() {
    setPaying(true);
    setError("");

    try {
      const response = await fetch("/api/create-remaining-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, token }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo iniciar el pago.");
      }

      router.push(data.url);
    } catch (paymentError) {
      setError(paymentError.message || "No se pudo iniciar el pago.");
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <p className="rounded-lg bg-white p-6 shadow">Cargando reserva...</p>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow">
      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="space-y-3 rounded-xl border bg-gray-50 p-5">
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
            result.payments.map((payment) => (
              <p key={payment.id}>
                {payment.amount} MXN - {payment.status}
              </p>
            ))
          ) : (
            <p>⏳ Confirmando pago...</p>
          )}

          {result.remaining > 0 && (
            <button
              onClick={handlePayRemaining}
              disabled={paying}
              className="mt-4 w-full rounded-xl bg-green-600 py-3 text-white disabled:opacity-50"
            >
              {paying
                ? "Redirigiendo..."
                : result.totalPaid > 0
                  ? "Pagar saldo pendiente"
                  : "Pagar total"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
