export default function BookingSummary({ date, guests }) {
  const pricePerPerson = 4000;

  const total = guests * pricePerPerson;
  const deposit = Math.round(total * 0.2);

  return (
    <div className="bg-gray-100 p-6 rounded-2xl space-y-2">
      <h2 className="text-xl font-semibold">Resumen</h2>

      <p>Fecha: {date || "—"}</p>
      <p>Personas: {guests}</p>
      <p>Total: ${total}</p>
      <p className="font-bold">Depósito (20%): ${deposit}</p>
    </div>
  );
}
