import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The National Degree College, Bagepalli | SCMS",
  description:
    "Smart College Management System for The National Degree College, Bagepalli.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}