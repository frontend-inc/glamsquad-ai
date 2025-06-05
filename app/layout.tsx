import HeaderAuth from "@/components/header-auth";
import { Geist } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className}>
      <body className="bg-white text-gray-900">
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <nav className="w-full flex justify-center h-16 border-b">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex-1" />
                <Link href={"/"} className="absolute left-1/2 transform -translate-x-1/2">
                  <Image
                    src="/logo.svg"
                    alt="GlamSquad"
                    width={150}
                    height={40}
                    priority
                  />
                </Link>
                <div className="flex-1 flex justify-end">
                  <HeaderAuth />
                </div>
              </div>
            </nav>
            <div className="flex flex-col gap-20 max-w-5xl p-5">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
