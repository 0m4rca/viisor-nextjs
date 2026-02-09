import BookingPageClient from "./BookingPageClient";

export default function Page({ params }) {
  return <BookingPageClient slug={params.slug} />;
}
