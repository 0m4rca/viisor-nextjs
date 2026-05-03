//create-checkout-session.js//
import Stripe from "stripe";
import { supabase } from "../../../lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { tour, selectedDate, customer, companions } = await req.json();

    /* 1️⃣ guest */
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

    /* 2️⃣ tour_date */
    const dateString = new Date(selectedDate.date).toISOString().split("T")[0];

    const { data: tourDate } = await supabase
      .from("tour_dates")
      .insert([{ tour_id: tour.id, date: dateString }])
      .select()
      .single();

    /* 3️⃣ booking */
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
        },
      ])
      .select()
      .single();

    /* 4️⃣ booking_guests (🔥 AQUÍ SE GUARDAN TALLAS) */
    await supabase.from("booking_guests").insert([
      {
        booking_id: booking.id,
        guest_id: guest.id,
        name: customer.name,
        fin_size: customer.finSize,
        bcd_size: customer.bcdSize,
        wetsuit_size: customer.wetsuitSize,
        certification: customer.certification,
      },
      ...companions.map((c) => ({
        booking_id: booking.id,
        name: c.name,
        fin_size: c.finSize,
        bcd_size: c.bcdSize,
        wetsuit_size: c.wetsuitSize,
        certification: c.certification,
      })),
    ]);

    /* 5️⃣ stripe */
    const origin = req.headers.get("origin");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: { name: `${tour.name} - Depósito` },
            unit_amount: Math.round(deposit * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?booking=${booking.id}&email=${customer.email}`,
      cancel_url: `${origin}/booking/${tour.slug}`,
      metadata: {
        booking_id: booking.id,
      },
    });

    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
