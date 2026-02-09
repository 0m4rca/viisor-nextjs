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

    const tour = JSON.parse(session.metadata.tour);
    const selectedDate = JSON.parse(session.metadata.selectedDate);
    const customer = JSON.parse(session.metadata.customer);
    const companions = JSON.parse(session.metadata.companions);

    /* =========================
       1️⃣ guest principal
    ========================== */

    let guest;

    const { data: existing } = await supabase
      .from("guests")
      .select("*")
      .eq("email", customer.email)
      .single();

    if (existing) guest = existing;
    else {
      const { data } = await supabase
        .from("guests")
        .insert([
          {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          },
        ])
        .select()
        .single();

      guest = data;
    }

    /* =========================
       2️⃣ tour_date
    ========================== */

    const dateString = new Date(selectedDate.date).toISOString().split("T")[0];

    const { data: tourDate } = await supabase
      .from("tour_dates")
      .insert([{ tour_id: tour.id, date: dateString }])
      .select()
      .single();

    /* =========================
       3️⃣ booking
    ========================== */

    const guestsCount = companions.length + 1;

    const { data: booking } = await supabase
      .from("bookings")
      .insert([
        {
          guest_id: guest.id,
          tour_date_id: tourDate.id,
          num_people: guestsCount,
          total_price: tour.price * guestsCount,
          deposit_paid: true,
          status: "confirmed",
        },
      ])
      .select()
      .single();

    /* =========================
       4️⃣ booking_guests
    ========================== */

    const rows = [
      {
        booking_id: booking.id,
        guest_id: guest.id,
        name: customer.name,
      },
      ...companions.map((c) => ({
        booking_id: booking.id,
        name: c.name,
      })),
    ];

    await supabase.from("booking_guests").insert(rows);

    /* =========================
       5️⃣ payments
    ========================== */

    await supabase.from("payments").insert([
      {
        booking_id: booking.id,
        amount: session.amount_total / 100,
        status: "paid",
      },
    ]);
  }

  return new Response("ok");
}
