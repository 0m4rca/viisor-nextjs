import { supabase } from "../../../lib/supabaseClient";
import BookingPageClient from "./BookingPageClient";

export default async function Page({ params }) {
  const { slug } = await params;

  const { data: tour, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !tour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg text-red-600">Tour not found</p>
      </div>
    );
  }

  return <BookingPageClient tour={tour} />;
}
