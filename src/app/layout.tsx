// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/app/components/theme-provider";
import { AuthProvider } from "@/app/components/auth-provider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ClientToaster } from "@/app/components/client-toaster"; // ← Nouvel import
import "./globals.css";

const geistSans = {
  variable: "--font-geist-sans",
  style: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
};

const geistMono = {
  variable: "--font-geist-mono",
  style: { fontFamily: "monospace" },
};
export const metadata: Metadata = {
  title: "WhizCyber - Cybersecurity Awareness Platform",
  description:
    "Learn to navigate safely online. Educational platform for parents, children, and seniors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <ClientToaster /> {/* ← Maintenant c'est un client component */}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
