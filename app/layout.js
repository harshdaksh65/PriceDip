import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";



export const metadata = {
  title: "PriceDip",
  description: "Smart Product Price Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
