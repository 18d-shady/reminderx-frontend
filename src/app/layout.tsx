// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import SidebarWrapper from "@/components/SidebarWrapper";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // regular, medium, semi-bold, bold
});

export const metadata: Metadata = {
  title: "Naikas Reminders App",
  description: "Never forget to renew again",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased md:flex min-h-screen overflow-x-hidden`}
      >
        <SidebarWrapper />

        <ClientLayoutWrapper>
          <NavbarWrapper />
          <main className="flex-1 ">{children}</main>
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
