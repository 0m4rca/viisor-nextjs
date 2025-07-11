import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Omar's Diving Adventures",
  description: "Book your next diving tour in La Paz!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-secondary text-tertiary`}>
        {children}
      </body>
    </html>
  );
}
