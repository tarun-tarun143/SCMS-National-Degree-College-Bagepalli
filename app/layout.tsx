import type { Metadata } from "next";

import "./globals.css";

import SplashScreen from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title:
    "The National Degree College, Bagepalli | SCMS",

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SplashScreen duration={3500} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}