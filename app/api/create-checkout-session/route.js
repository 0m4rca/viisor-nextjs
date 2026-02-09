import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { tour, selectedDate, customer, companions } = await req.json();

  try {
    const guestsCount = companions.length + 1;
    const totalPrice = tour.price * guestsCount;
    const deposit = totalPrice * 0.2;

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

      /* 🔥 TODA LA INFO AQUÍ */
      metadata: {
        tour: JSON.stringify(tour),
        selectedDate: JSON.stringify(selectedDate),
        customer: JSON.stringify(customer),
        companions: JSON.stringify(companions),
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
