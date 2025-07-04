import type { Metadata } from "next";

import "./globals.css";
import AuthProvider from "@/libs/provider";

export const metadata: Metadata = {
  title: "Invexa",
  description:
    "Invexa is a inventory management platform where organizations can track , analyze and maintain there inventory along with invoice generations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full bg-[#F5F5F5]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
