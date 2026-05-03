import Stripe from "stripe";
import { supabase } from "../../../lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { bookingId } = await req.json();

  if (!bookingId) {
    return Response.json({ error: "Missing bookingId" }, { status: 400 });
  }

  // 1. booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  // 1.5. Obtener email del guest
  const { data: guest } = await supabase
    .from("guests")
    .select("email")
    .eq("id", booking.guest_id)
    .single();

  // 2. payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", bookingId);

  const totalPaid = (payments || []).reduce((s, p) => s + Number(p.amount), 0);
  const remaining = Number(booking.total_price) - totalPaid;

  if (remaining <= 0) {
    // Si ya está pagado completamente, actualizar status y devolver error
    await supabase
      .from("bookings")
      .update({ status: "fully paid" })
      .eq("id", bookingId);

    return Response.json({ error: "Already fully paid" }, { status: 400 });
  }

  const origin = req.headers.get("origin");

  // 3. Stripe session (remaining)
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: guest?.email,
    line_items: [
      {
        price_data: {
          currency: "mxn",
          product_data: {
            name: `Pago restante - Reserva ${booking.id}`,
          },
          unit_amount: Math.round(remaining * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/success?booking=${booking.id}`,
    cancel_url: `${origin}/booking/status?bookingId=${booking.id}`,
    metadata: {
      booking_id: booking.id,
      type: "remaining",
    },
  });

  return Response.json({ url: session.url });
}
