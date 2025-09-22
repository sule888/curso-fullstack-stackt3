"use client";

import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          {children} <Toaster />{" "}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
