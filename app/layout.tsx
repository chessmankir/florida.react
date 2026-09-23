import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Florida Analytics",
  description: "Аналитика продаж и товаров",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
          <Sidebar />
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
