import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DompetKu - Kelola Keuangan Pribadi",
  description: "Aplikasi sederhana untuk mencatat pemasukan dan pengeluaran harian Anda.",
};

import { MobileNav } from "@/components/ui/mobile-nav";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased pb-20 md:pb-0 font-sans bg-zinc-50 dark:bg-zinc-950`}
      >
        <main>{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
