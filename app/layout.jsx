import "./globals.css";
import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import Navigation from "../components/Navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "700"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Omar's Diving Adventures",
  description: "Book your next diving tour in La Paz!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`md:px-8 md:py-6 lg:px-16 lg:py-10 ${montserrat.variable} font-sans bg-secondary text-tertiary`}
      >
        <div className="relative">
          <Navigation />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
