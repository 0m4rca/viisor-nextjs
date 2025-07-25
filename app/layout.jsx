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
  title: "VIISOR - Diving Tours in La Paz",
  description:
    "Book your next diving adventure in La Paz, Mexico with VIISOR! Certified and beginner-friendly tours available.",
  icons: {
    icon: "/viisor-small.png",
    shortcut: "/viisor-small.png",
    apple: "/viisor-small.png",
  },
  keywords: [
    "scuba diving",
    "La Paz",
    "diving tours",
    "Mexico",
    "beginner diving",
    "certified divers",
    "diving courses",
  ],
  authors: [{ name: "VIISOR Diving", url: "https://viisordiving.com" }],
  creator: "VIISOR Diving",
  publisher: "VIISOR Diving",
  robots: "index, follow",

  openGraph: {
    title: "VIISOR - Scuba Diving Tours in La Paz",
    description:
      "Explore the underwater world in La Paz with certified guides. Book your dive today!",
    url: "https://viisordiving.com",
    siteName: "VIISOR Diving",
    images: [
      {
        url: "/og-image.jpg", // Puedes poner un logo o una imagen del mar o de buzos.
        width: 1200,
        height: 630,
        alt: "VIISOR Diving Tours",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "VIISOR - Diving Tours in La Paz",
    description:
      "Book your next diving adventure in La Paz, Mexico with VIISOR.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`md:px-6 md:py-6 lg:px-10 lg:py-10 ${montserrat.variable}  font-sans bg-secondary text-tertiary`}
      >
        <div className="relative">
          <Navigation />
        </div>
        <main className="bg-[var(--color-secondary-dark)]">{children}</main>
      </body>
    </html>
  );
}
