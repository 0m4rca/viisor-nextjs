//stripe-webhook.js//
import Stripe from "stripe";
import { supabase } from "../../../lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.booking_id;
    const paymentType = session.metadata.type; // "deposit" o "remaining"

    // 1. Obtener el booking
    const { data: booking } = await supabase
      .from("bookings")
      .select("total_price, status")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return new Response("Booking not found", { status: 404 });
    }

    // 2. Obtener pagos EXISTENTES ANTES de insertar el nuevo
    const { data: existingPayments } = await supabase
      .from("payments")
      .select("amount")
      .eq("booking_id", bookingId);

    const previouslyPaid = (existingPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);

    // 3. Calcular el monto del pago actual
    const currentPaymentAmount = Number(session.amount_total) / 100;

    // 4. Calcular total después de este pago
    const totalAfterThisPayment = previouslyPaid + currentPaymentAmount;

    // 5. Guardar el pago
    await supabase.from("payments").insert([
      {
        booking_id: bookingId,
        amount: currentPaymentAmount,
        status: "paid",
      },
    ]);

    // 6. Determinar el nuevo status (convertir a números para comparación segura)
    const totalPrice = Number(booking.total_price);
    let updateData = { deposit_paid: true, status: "confirmed" };

    if (totalAfterThisPayment >= totalPrice) {
      updateData = { deposit_paid: true, status: "fully paid" };
    }

    // 7. Actualizar booking
    await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId);
  }

  return new Response("ok");
}
