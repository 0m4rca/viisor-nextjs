import { supabase } from "../../../lib/supabaseClient";
import { hashBookingAccessToken } from "../../../lib/bookingAccess";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");
  const accessToken = searchParams.get("token");

  if (!bookingId || !accessToken) {
    return Response.json(
      { error: "Se requiere el enlace privado de la reserva." },
      { status: 400 },
    );
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      "id, guest_id, tour_date_id, num_people, total_price, status, deposit_paid, created_at",
    )
    .eq("id", bookingId)
    .eq("access_token_hash", hashBookingAccessToken(accessToken))
    .single();

  if (bookingError || !booking) {
    return Response.json(
      { error: "Enlace de reserva inválido." },
      { status: 404 },
    );
  }

  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", bookingId);

  if (paymentsError) {
    return Response.json(
      { error: "No se pudieron consultar los pagos." },
      { status: 500 },
    );
  }

  const totalPaid = (payments || []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );
  const remaining = Number(booking.total_price) - totalPaid;

  return Response.json({
    booking,
    payments: payments || [],
    totalPaid,
    remaining,
  });
}
