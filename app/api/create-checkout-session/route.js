//create-checkout-session.js//
import Stripe from "stripe";
import { supabase } from "../../../lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { tour, selectedDate, customer, companions } = await req.json();

  try {
    /* =========================
       1️⃣ guest
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
          { name: customer.name, email: customer.email, phone: customer.phone },
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
       3️⃣ booking PENDING
    ========================== */

    const guestsCount = companions.length + 1;
    const totalPrice = tour.price * guestsCount;
    const deposit = totalPrice * 0.2;

    const { data: booking } = await supabase
      .from("bookings")
      .insert([
        {
          guest_id: guest.id,
          tour_date_id: tourDate.id,
          num_people: guestsCount,
          total_price: totalPrice,
          status: "pending",
          deposit_paid: false,
        },
      ])
      .select()
      .single();

    /* =========================
       4️⃣ stripe
    ========================== */

    const origin = req.headers.get("origin");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,

      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `${tour.name} - Depósito`,
            },
            unit_amount: Math.round(deposit * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${origin}/success`,
      cancel_url: `${origin}/booking/${tour.slug}`,

      // 🔥 SOLO ID
      metadata: {
        booking_id: booking.id.toString(),
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
