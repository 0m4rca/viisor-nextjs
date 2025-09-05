import TourList from "../components/TourList";
import Header from "../components/Header";
import HeadingSecondary from "../components/HeadingSecondary";
import "../styles/globals.css";

export default function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <HeadingSecondary>Explore all our tours</HeadingSecondary>
        <TourList />
      </main>
      <footer className="bg-grey-dark-3 text-white p-6 text-center">
        © 2025 VIISOR DIVING
      </footer>
    </div>
  );
}
