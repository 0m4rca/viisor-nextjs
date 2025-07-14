import "./globals.css";
import { Montserrat } from "next/font/google";
import "../styles/globals.css";

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
        className={`${montserrat.variable} font-sans bg-secondary text-tertiary`}
      >
        {children}
      </body>
    </html>
  );
}
