// app/(auth)/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { AuthHeader } from "@/app/components/layouts/headers/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getBackgroundImage = () => {
    if (pathname === "/auth/login") return "/images/login-bg.png";
    if (pathname === "/auth/signup") return "/images/register-bg.png";
    if (pathname === "/auth/forgot-password") return "/images/forgot-bg.png";
    if (pathname === "/auth/reset-password") return "/images/reset-bg.png";
    return "/images/auth-bg.png";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <AuthHeader />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] py-8 px-4">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
