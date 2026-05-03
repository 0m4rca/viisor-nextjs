import { supabase } from "../../../lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");
  const email = searchParams.get("email");

  if (!bookingId) {
    return Response.json({ error: "Falta bookingId." }, { status: 400 });
  }

  let booking;

  // 🟢 CASO 1: con email (usuario manual)
  if (email) {
    const { data: guest, error: guestError } = await supabase
      .from("guests")
      .select("id")
      .eq("email", email)
      .single();

    if (guestError || !guest) {
      return Response.json(
        { error: "No se encontró un cliente con ese email." },
        { status: 404 },
      );
    }

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("guest_id", guest.id)
      .single();

    if (bookingError || !bookingData) {
      return Response.json(
        { error: "No se encontró la reserva con ese ID para este email." },
        { status: 404 },
      );
    }

    booking = bookingData;
  }

  // 🔵 CASO 2: sin email (Stripe / success page)
  else {
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !bookingData) {
      return Response.json(
        { error: "No se encontró la reserva." },
        { status: 404 },
      );
    }

    booking = bookingData;
  }

  // 3️⃣ pagos
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", bookingId);

  const totalPaid = (payments || []).reduce((sum, p) => sum + p.amount, 0);
  const remaining = booking.total_price - totalPaid;

  return Response.json({
    booking,
    payments: payments || [],
    totalPaid,
    remaining,
  });
}
