import TourList from "../components/TourList";
import Header from "../components/Header";
import HeadingSecondary from "../components/HeadingSecondary";
import "../styles/globals.css";

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="p-6 ">
        <HeadingSecondary>Explore our tours</HeadingSecondary>
        <TourList />
      </main>
      <footer className="bg-primary text-white p-6 text-center">
        © 2025 Omar's Diving Adventures
      </footer>
    </div>
  );
}
