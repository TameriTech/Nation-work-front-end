"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 bg-white shadow-sm z-50">
      <div className="relative w-full h-full">
        <div className="max-w-7xl mx-auto px-2 md:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <img src="/icons/logo-text.png" alt="Logo" className="h-12" />

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6 font-medium text-gray-700 text-base">
            <a href="#" className="hover:text-orange-500">
              Accueil
            </a>
            <a href="#" className="hover:text-orange-500">
              Comment ça marche ?
            </a>
            <a href="#" className="hover:text-orange-500">
              Devenir Prestataire
            </a>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex text-base gap-3">
            <a href="/dashboard/customer" className="px-4 py-2 text-gray-700">
              Se connecter
            </a>
            <a
              href="/dashboard/customer"
              className="px-4 py-2 rounded-2xl bg-blue-900 text-white"
            >
              Créer un compte
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Ouvrir le menu"
            className="md:hidden text-gray-700"
          >
            <Icon icon={open ? "bi:x-lg" : "bi:list"} className="w-7 h-7" />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="absolute w-full md:hidden border-t border-gray-100 bg-white">
            <nav className="flex flex-col px-2 md:px-6 py-4 gap-4 font-medium text-gray-700">
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="hover:text-orange-500"
              >
                Accueil
              </a>
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="hover:text-orange-500"
              >
                Comment ça marche ?
              </a>
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="hover:text-orange-500"
              >
                Devenir Prestataire
              </a>

              <div className="pt-4 flex flex-col gap-3">
                <a
                  href="/dashboard/customer"
                  className="px-4 py-2 text-center text-gray-700 border rounded-xl"
                >
                  Se connecter
                </a>
                <a
                  href="/dashboard/customer"
                  className="px-4 py-2 text-center rounded-xl bg-blue-900 text-white"
                >
                  Créer un compte
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
