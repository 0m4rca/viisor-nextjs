"use client";

export default function PaymentSection({
  tour,
  selectedDate,
  guests,
  customer,
}) {
  async function handlePay() {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour,
          selectedDate,
          guests,
          customer,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // 👉 redirige a Stripe
      }
    } catch (err) {
      console.error(err);
      alert("Error iniciando pago");
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={!selectedDate || !customer?.email}
      className="w-full bg-black text-white p-4 rounded-xl disabled:opacity-40"
    >
      Pagar depósito
    </button>
  );
}
