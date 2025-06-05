import { Geist, Playfair_Display } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "GlamSquad AI Assistant",
  description: "Book beauty services with GlamSquad's AI assistant",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} ${playfairDisplay.variable}`}>
      <body className="bg-white text-gray-900">
        <Header />
        <main className="min-h-screen flex flex-col pt-16 pb-24">
          <div className="flex-1">
            <div className="flex flex-col gap-20 max-w-5xl w-full mx-auto p-5">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
