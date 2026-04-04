import "./globals.css";
import { AppShell } from "@/components/app-shell";
import type { ReactNode } from "react";

export const metadata = {
  title: "LexOra — Legal Operations Platform",
  description: "Premium case and client management for modern law firms"
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
