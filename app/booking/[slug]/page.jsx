import BookingPageClient from "./BookingPageClient";

export default async function Page({ params }) {
  const { slug } = await params;

  return <BookingPageClient slug={slug} />;
}
