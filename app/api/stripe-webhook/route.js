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

    await supabase
      .from("bookings")
      .update({
        deposit_paid: true,
        status: "confirmed",
      })
      .eq("id", bookingId);

    await supabase.from("payments").insert([
      {
        booking_id: bookingId,
        amount: session.amount_total / 100,
        status: "paid",
      },
    ]);
  }

  return new Response("ok");
}
