"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const isLogin = usePathname().match("/auth/login");
  return (
    <header className="w-full sticky rounded-[30px] h-20 top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          <img src="/icons/logo-text.png" alt="Logo" className="h-14" />
        </Link>
        {isLogin ? (
          <nav className="hidden md:flex gap-6 font-medium text-gray-700 text-base">
            <span className="hover:text-orange-500">
              {"Vous avez déjà un compte ?"}
            </span>
            <a href="/auth/register" className="text-blue-900">
              Inscrivez-vous
            </a>
          </nav>
        ) : (
          <nav className="hidden md:flex gap-6 font-medium text-gray-700 text-base">
            <span className="hover:text-orange-500">
              {"Vous n'avez pas de compte ?"}
            </span>
            <a href="/auth/login" className="text-blue-900">
              Connectez vous
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
