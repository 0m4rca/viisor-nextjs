//create-checkout-session.js//
import Stripe from "stripe";
import { supabase } from "../../../lib/supabaseClient";
import {
  createBookingAccessToken,
  hashBookingAccessToken,
} from "../../../lib/bookingAccess";
import { sendBookingStartedEmail } from "../../../lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const allowedWetsuitSizes = new Set(["S", "M", "L", "XL"]);
const allowedCertifications = new Set([
  "Open Water",
  "Advanced Open Water",
  "Rescue Diver",
]);
const allowedFinSizes = new Set([
  ...Array.from({ length: 11 }, (_, index) => `US ${index + 4}`),
  ...Array.from({ length: 12 }, (_, index) => `EU ${index + 36}`),
  ...Array.from({ length: 10 }, (_, index) => `MX ${index + 22}`),
]);

function isValidDiver(person) {
  const dives = Number(person.numberOfDives);
  return (
    typeof person.name === "string" &&
    person.name.trim().length > 0 &&
    allowedFinSizes.has(person.finSize) &&
    allowedWetsuitSizes.has(person.wetsuitSize) &&
    (!person.certification ||
      allowedCertifications.has(person.certification)) &&
    Number.isInteger(dives) &&
    dives >= 0
  );
}

export async function POST(req) {
  try {
    const { tour, selectedDate, customer, companions, paymentOption } =
      await req.json();

    if (!tour?.id || !selectedDate?.id || !customer?.email) {
      return Response.json(
        { error: "Faltan datos de tour, fecha o cliente." },
        { status: 400 },
      );
    }

    if (paymentOption && !["deposit", "full"].includes(paymentOption)) {
      return Response.json(
        { error: "Forma de pago no válida." },
        { status: 400 },
      );
    }
    const selectedPaymentOption = paymentOption === "full" ? "full" : "deposit";

    const guestCompanions = Array.isArray(companions) ? companions : [];
    const customerData = customer || {};
    const divers = [customerData, ...guestCompanions];
    if (divers.some((person) => !isValidDiver(person))) {
      return Response.json(
        {
          error: "Revisa nombres, tallas, certificaciones y número de buceos.",
        },
        { status: 400 },
      );
    }

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
    if (guestsCount > Number(tourData.max_capacity)) {
      return Response.json(
        { error: "El grupo supera la capacidad máxima del tour." },
        { status: 400 },
      );
    }
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
    const amountToCharge =
      selectedPaymentOption === "full" ? totalPrice : totalPrice * 0.2;
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
          number_of_dives: Number(customer.numberOfDives),
        },
        ...guestCompanions.map((c) => ({
          booking_id: booking.id,
          name: c.name,
          fin_size: c.finSize,
          bcd_size: c.bcdSize,
          wetsuit_size: c.wetsuitSize,
          certification: c.certification,
          number_of_dives: Number(c.numberOfDives),
        })),
      ]);

    if (bookingGuestsError) throw bookingGuestsError;

    /* 5️⃣ stripe */
    const siteUrl = process.env.APP_URL || req.headers.get("origin");
    if (!siteUrl) throw new Error("Falta configurar APP_URL.");

    const successUrl = new URL("/success", siteUrl);
    successUrl.searchParams.set("booking", booking.id);
    successUrl.searchParams.set("token", accessToken);
    const cancelUrl = new URL(`/booking/${tourData.slug}`, siteUrl);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `${tourData.name} - ${selectedPaymentOption === "full" ? "Pago total" : "Depósito"}`,
            },
            unit_amount: Math.round(amountToCharge * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      metadata: {
        booking_id: booking.id,
        type: selectedPaymentOption,
      },
    });

    const { error: sessionUpdateError } = await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    if (sessionUpdateError) throw sessionUpdateError;

    const bookingUrl = new URL("/booking/status", siteUrl);
    bookingUrl.searchParams.set("bookingId", booking.id);
    bookingUrl.searchParams.set("token", accessToken);

    const emailSent = await sendBookingStartedEmail({
      to: customer.email,
      customerName: customer.name,
      tourName: tourData.name,
      tourDate: tourDate.date,
      bookingUrl: bookingUrl.toString(),
    });

    return Response.json({ url: session.url, emailSent });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
