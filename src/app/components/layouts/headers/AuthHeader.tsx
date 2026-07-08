// app/components/layouts/headers/AuthHeader.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export function AuthHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  // Déterminer si on est sur la page login
  const isLogin = pathname === "/auth/login";
  const isRegister = pathname === "/auth/signup";
  const isForgotPassword = pathname === "/auth/forgot-password";
  const isResetPassword = pathname === "/auth/reset-password";

  // Message et liens selon la page
  const getAuthMessage = () => {
    if (isLogin) {
      return {
        message: "Vous n'avez pas de compte ?",
        linkText: "Inscrivez-vous",
        linkHref: "/auth/signup",
      };
    }
    if (isRegister) {
      return {
        message: "Vous avez déjà un compte ?",
        linkText: "Connectez-vous",
        linkHref: "/auth/login",
      };
    }
    if (isForgotPassword) {
      return {
        message: "Vous vous souvenez de votre mot de passe ?",
        linkText: "Connectez-vous",
        linkHref: "/auth/login",
      };
    }
    if (isResetPassword) {
      return {
        message: "Retour à la",
        linkText: "connexion",
        linkHref: "/auth/login",
      };
    }
    return null;
  };

  const authData = getAuthMessage();

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">N</span>
              </div>
            </div>
            <span className="font-semibold text-xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Tameri<span className="text-primary">Work</span>
            </span>
          </Link>

          {/* Desktop Navigation - Auth links */}
          <div className="hidden ml-auto mr-2 md:flex items-center gap-6">
            {authData && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {authData.message}
                </span>
                <Link
                  href={authData.linkHref}
                  className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-full shadow-md shadow-primary/25 hover:shadow-lg hover:scale-105 transition-all hover:bg-primary/90"
                >
                  {authData.linkText}
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Changer le thème"
            >
              <Icon
                icon={isDark ? "ph:sun" : "ph:moon"}
                className="w-4 h-4 text-gray-600 dark:text-gray-300"
              />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <Icon
                icon={isMobileMenuOpen ? "ph:x" : "ph:list"}
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && authData && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {authData.message}
              </p>
              <Link
                href={authData.linkHref}
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {authData.linkText}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
