// app/components/Header.tsx - Header unifié pour tous les rôles
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/hooks/use-auth";
import { UserRole } from "@/app/types";
import { ProfileDropdown } from "../../ui/profile-dropdown";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // Get user and loading state from useAuth
  const { user, isLoading, isAuthenticated } = useAuth();


  // Effet pour le scroll et le thème
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

  // 🔥 Déterminer le rôle de l'utilisateur avec fallback
  const userRole = user?.role || UserRole.GUEST;

  // 🔥 Navigation selon le rôle
  const getNavLinks = () => {
    // Si pas authentifié, navigation publique
    if (!isAuthenticated || !user) {
      return [
        { name: "Accueil", href: "/", icon: "ph:house" },
        { name: "Services", href: "/missions", icon: "ph:sparkle" },
        { name: "Prestataires", href: "/prestataires", icon: "ph:users" },
        { name: "Devenir freelance", href: "/devenir-freelance", icon: "ph:briefcase" },
      ];
    }

    // Navigation selon le rôle
    if (userRole === UserRole.PROVIDER) {
      return [
        { name: "Tableau de bord", href: "/dashboard/provider", icon: "ph:layout" },
        { name: "Mes missions", href: "/dashboard/provider/missions", icon: "ph:briefcase" },
        { name: "Finances", href: "/dashboard/provider/profile/finances", icon: "ph:credit-card" },
        { name: "Messagerie", href: "/dashboard/provider/messaging", icon: "ph:chat" },
      ];
    }
    
    if (userRole === UserRole.CLIENT) {
      return [
        { name: "Tableau de bord", href: "/dashboard/customer", icon: "ph:layout" },
        { name: "Mes services", href: "/dashboard/customer/missions", icon: "ph:sparkle" },
        { name: "Mes prestataires", href: "/dashboard/customer/candidatures", icon: "ph:users" },
        { name: "Messagerie", href: "/dashboard/customer/messaging", icon: "ph:chat" },
      ];
    }
    
    if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
      return [
        { name: "Tableau de bord", href: "/dashboard/admin", icon: "ph:layout" },
        { name: "Utilisateurs", href: "/dashboard/admin/users", icon: "ph:users" },
        { name: "Rapports", href: "/dashboard/admin/reports", icon: "ph:chart-bar" },
        { name: "Paramètres", href: "/dashboard/admin/settings", icon: "ph:gear" },
      ];
    }

    // Fallback
    return [
      { name: "Accueil", href: "/", icon: "ph:house" },
    ];
  };

  const navLinks = getNavLinks();

  // 🔥 Récupérer le nom d'affichage
  const getDisplayName = () => {
    if (!user) return "";
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return "User";
  };

  // 🔥 Vérifier si on est sur une page d'authentification
  const isAuthPage = pathname.startsWith("/auth/");

  // 🔥 Ne pas afficher le header sur les pages d'authentification
  if (isAuthPage) {
    return null;
  }

  // 🔥 État de chargement
  if (isLoading) {
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
                  <span className="text-white font-bold text-lg">T</span>
                </div>
              </div>
              <span className="font-semibold text-xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Tameri<span className="text-primary">Work</span>
              </span>
            </Link>

            {/* Loading indicator */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Icon icon="ph:spinner" className="w-4 h-4 text-primary animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

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
          {/* Logo - redirection selon l'état d'auth */}
          <Link 
            href={isAuthenticated && user ? `/dashboard/${user.role}` : "/"} 
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">T</span>
              </div>
            </div>
            <span className="font-semibold text-xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Tameri<span className="text-primary">Work</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary"
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <Icon icon={link.icon} className="w-4 h-4" />}
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
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

            {/* 🔥 User Section - synchronisé avec l'état d'auth */}
            {isAuthenticated && user ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-full shadow-md shadow-primary/25 hover:shadow-lg hover:scale-105 transition-all hover:bg-primary/90"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <Icon
                icon={isMobileMenuOpen ? "ph:x" : "ph:list"}
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
              />
            </button>
          </div>
        </div>

        {/* 🔥 Mobile Menu - synchronisé avec l'état d'auth */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon && <Icon icon={link.icon} className="w-4 h-4" />}
                  {link.name}
                </Link>
              ))}
              
              {/* 🔥 Mobile - Actions selon l'état d'auth */}
              {!isAuthenticated && (
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary/90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
              
              {/* 🔥 Mobile - Informations utilisateur si connecté */}
              {isAuthenticated && user && (
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Connecté en tant que{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {getDisplayName()}
                    </span>
                  </div>
                  <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 capitalize">
                    Rôle: {user.role}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}