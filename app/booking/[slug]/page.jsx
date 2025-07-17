import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function BookingPage({ params }) {
  const { slug } = params;

  const { data: tour, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg text-red-600">
          Hubo un error: {error.message}
        </p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg">Tour no encontrado</p>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        <Image
          src={tour.image_url}
          alt={tour.name}
          width={1200}
          height={600}
          className="w-full object-cover h-[350px] md:h-[500px]"
          style={{ objectPosition: "center top" }}
        />

        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-tertiary mb-4 text-center">
            {tour.name}
          </h1>

          <p className="text-gray-800 leading-relaxed mb-8 text-justify">
            {tour.long_description}
          </p>

          <div className="flex items-center justify-between flex-wrap">
            <p className="text-2xl font-semibold text-primary">${tour.price}</p>

            <button className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-opacity-90 transition">
              book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
