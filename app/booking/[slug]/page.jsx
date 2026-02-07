import BookingPageClient from "./BookingPageClient";
import { supabase } from "../../../lib/supabaseClient";

export default async function Page({ params }) {
  const { slug } = params;

  // traer tour por slug
  const { data: tour, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !tour) {
    return <p>Tour not found</p>;
  }

  return <BookingPageClient tour={tour} />;
}
