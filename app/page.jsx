import Link from "next/link";
import TourList from "../components/TourList";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Explore Our Tours</h2>
        <TourList />
      </main>
      <footer className="bg-primary text-white p-6 text-center">
        © 2025 Omar's Diving Adventures
      </footer>
    </div>
  );
}
