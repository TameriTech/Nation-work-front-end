"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  date?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export default function Header({
  userName = "Cali Biba",
  userRole = "Etudiante / Ménagère",
  userAvatar,
}: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm rounded-[30px] p-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <img src="/icons/logo-text.png" alt="Logo" className="h-12" />

        {/* Desktop navigation */}
        <nav className="hidden lg:flex gap-6 font-medium text-gray-700">
          <Link
            href="/dashboard/freelancer"
            className={
              pathname === "/dashboard/freelancer"
                ? "text-orange-500"
                : "hover:text-orange-500"
            }
          >
            Votre profile
          </Link>
          <Link
            href="/dashboard/freelancer/jobs"
            className={
              pathname === "/dashboard/freelancer/jobs"
                ? "text-orange-500"
                : "hover:text-orange-500"
            }
          >
            Trouver une offre
          </Link>
          <Link
            href="/dashboard/freelancer/agenda"
            className={
              pathname === "/dashboard/freelancer/agenda"
                ? "text-orange-500"
                : "hover:text-orange-500"
            }
          >
            Agenda
          </Link>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Icons */}
          <button className="hidden md:flex p-2 rounded-full border border-[#69BBFF] text-blue-900">
            <Icon icon="bx:help-circle" className="w-5 h-5" />
          </button>
          <button className="hidden md:flex p-2 rounded-full border border-[#69BBFF] text-blue-900">
            <Icon icon="bi:bell" className="w-5 h-5" />
          </button>

          {/* User (desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-400 gap-2 flex items-center justify-center">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-gray-500">{userRole}</span>
            </div>
          </div>

          {/* Burger (mobile only) */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-gray-800"
          >
            <Icon icon="ci:hamburger-md" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden mt-4 px-4 pb-4 space-y-4">
          <nav className="flex flex-col gap-4 text-gray-800 font-medium">
            <Link href="/dashboard/freelancer">Votre profile</Link>
            <Link href="/dashboard/freelancer/jobs">Trouver une offre</Link>
            <Link href="/dashboard/freelancer/agenda">Agenda</Link>
          </nav>

          <div className="flex items-center justify-between gap-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
            <div className="md:hidden flex items-center gap-3">
              <button className="p-2 rounded-full border border-[#69BBFF] text-blue-900">
                <Icon icon="bx:help-circle" className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full border border-[#69BBFF] text-blue-900">
                <Icon icon="bi:bell" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
