//create-checkout-session.js//
import Stripe from "stripe";
import { supabase } from "../../../lib/supabaseClient";
import {
  createBookingAccessToken,
  hashBookingAccessToken,
} from "../../../lib/bookingAccess";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { tour, selectedDate, customer, companions } = await req.json();

    if (!tour?.id || !selectedDate?.id || !customer?.email) {
      return Response.json(
        { error: "Faltan datos de tour, fecha o cliente." },
        { status: 400 },
      );
    }

    const guestCompanions = Array.isArray(companions) ? companions : [];

    const { data: tourData, error: tourError } = await supabase
      .from("tours")
      .select("id, name, slug, price, max_capacity")
      .eq("id", tour.id)
      .single();

    if (tourError || !tourData) {
      return Response.json(
        { error: "No se encontró el tour." },
        { status: 404 },
      );
    }

    const { data: tourDate, error: tourDateError } = await supabase
      .from("tour_dates")
      .select("id, date, tour_id")
      .eq("id", selectedDate.id)
      .eq("tour_id", tourData.id)
      .single();

    if (tourDateError || !tourDate) {
      return Response.json(
        { error: "La fecha seleccionada no está disponible para este tour." },
        { status: 400 },
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    if (tourDate.date < today) {
      return Response.json(
        { error: "No se pueden reservar fechas pasadas." },
        { status: 400 },
      );
    }

    const guestsCount = guestCompanions.length + 1;
    const { data: existingBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("num_people, status")
      .eq("tour_date_id", tourDate.id)
      .in("status", ["pending", "confirmed", "fully paid", "paid"]);

    if (bookingsError) throw bookingsError;

    const alreadyBooked = (existingBookings || []).reduce(
      (total, booking) => total + Number(booking.num_people || 0),
      0,
    );

    if (alreadyBooked + guestsCount > Number(tourData.max_capacity)) {
      return Response.json(
        { error: "No hay suficientes lugares disponibles para este grupo." },
        { status: 409 },
      );
    }

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

    /* 3️⃣ booking */
    const totalPrice = Number(tourData.price) * guestsCount;
    const deposit = totalPrice * 0.2;
    const accessToken = createBookingAccessToken();
    const accessTokenHash = hashBookingAccessToken(accessToken);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          guest_id: guest.id,
          tour_date_id: tourDate.id,
          num_people: guestsCount,
          total_price: totalPrice,
          status: "pending",
          access_token_hash: accessTokenHash,
        },
      ])
      .select()
      .single();

    if (bookingError || !booking)
      throw bookingError || new Error("No se pudo crear la reserva.");

    /* 4️⃣ booking_guests (🔥 AQUÍ SE GUARDAN TALLAS) */
    const { error: bookingGuestsError } = await supabase
      .from("booking_guests")
      .insert([
        {
          booking_id: booking.id,
          guest_id: guest.id,
          name: customer.name,
          fin_size: customer.finSize,
          bcd_size: customer.bcdSize,
          wetsuit_size: customer.wetsuitSize,
          certification: customer.certification,
        },
        ...guestCompanions.map((c) => ({
          booking_id: booking.id,
          name: c.name,
          fin_size: c.finSize,
          bcd_size: c.bcdSize,
          wetsuit_size: c.wetsuitSize,
          certification: c.certification,
        })),
      ]);

    if (bookingGuestsError) throw bookingGuestsError;

    /* 5️⃣ stripe */
    const origin = req.headers.get("origin");
    const successUrl = new URL("/success", origin);
    successUrl.searchParams.set("booking", booking.id);
    successUrl.searchParams.set("token", accessToken);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: { name: `${tourData.name} - Depósito` },
            unit_amount: Math.round(deposit * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl.toString(),
      cancel_url: `${origin}/booking/${tourData.slug}`,
      metadata: {
        booking_id: booking.id,
        type: "deposit",
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
