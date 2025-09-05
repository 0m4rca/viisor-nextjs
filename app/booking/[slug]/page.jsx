import { createClient } from "@supabase/supabase-js";
import BookingPageClient from "./BookingPageClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function Page({ params }) {
  const { slug } = params;

  const { data: tour, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !tour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg text-red-600">Tour no encontrado</p>
      </div>
    );
  }

  return <BookingPageClient tour={tour} />;
}
