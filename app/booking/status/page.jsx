import BookingStatusClient from "../../../components/booking/BookingStatusClient";

export default function BookingStatusPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-4">Seguimiento de pago</h1>
      <p className="mb-6 text-gray-700">
        Ingresa tu ID de reserva y el correo con el que pagaste para ver el
        estado del depósito.
      </p>
      <BookingStatusClient />
    </main>
  );
}
