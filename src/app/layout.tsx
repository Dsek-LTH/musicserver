import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music server",
  description:
    "Non-commercial music server to allow multiple people control 1 spotify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
