"use client";

export default function PaymentSection({ date, guests, customer }) {
  function handlePay() {
    alert("Aquí irá Stripe después 🚀");
  }

  return (
    <button
      onClick={handlePay}
      disabled={!date || !customer.email}
      className="w-full bg-black text-white p-4 rounded-xl disabled:opacity-40"
    >
      Pagar depósito
    </button>
  );
}
