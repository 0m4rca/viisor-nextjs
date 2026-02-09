import Stripe from "stripe";
import { supabase } from "../../../lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { tour, selectedDate, guests, customer } = await req.json();

  try {
    /* =========================
       1️⃣ crear o buscar guest
    ========================== */

    let guest;

    const { data: existing } = await supabase
      .from("guests")
      .select("*")
      .eq("email", customer.email)
      .single();

    if (existing) {
      guest = existing;
    } else {
      const { data } = await supabase
        .from("guests")
        .insert([{ name: customer.name, email: customer.email }])
        .select()
        .single();

      guest = data;
    }

    /* =========================
       2️⃣ crear tour_date
    ========================== */

    const dateString = new Date(selectedDate.date).toISOString().split("T")[0];

    const { data: newDate } = await supabase
      .from("tour_dates")
      .insert([{ tour_id: tour.id, date: dateString }])
      .select()
      .single();

    /* =========================
       3️⃣ crear booking pending
    ========================== */

    const totalPrice = tour.price * guests;
    const deposit = totalPrice * 0.2;

    const { data: booking } = await supabase
      .from("bookings")
      .insert([
        {
          guest_id: guest.id,
          tour_date_id: newDate.id,
          num_people: guests,
          total_price: totalPrice,
          status: "pending",
        },
      ])
      .select()
      .single();

    /* =========================
       4️⃣ stripe checkout
    ========================== */

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

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/${tour.slug}`,

      metadata: {
        booking_id: booking.id,
      },
    });

    /* guardar intent id */
    await supabase
      .from("bookings")
      .update({ payment_intent_id: session.id })
      .eq("id", booking.id);

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
