"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProfileDropdown } from "../../ui/profile-dropdown";
import { ThemeToggle } from "../../theme-toggle";

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
        <Link
          href="/dashboard/freelancer"
          className="text-2xl font-bold text-blue-900"
        >
          <img src="/icons/logo-text.png" alt="Logo" className="h-14" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex gap-6 font-medium text-gray-700">
          <Link
            href="/dashboard/freelancer"
            className={
              pathname === "/dashboard/freelancer"
                ? "text-orange-500"
                : "hover:text-orange-500"
            }
          ></Link>
          <Link
            href="/dashboard/freelancer/profile"
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
          <Link
            href="/dashboard/freelancer/messaging"
            className={
              pathname === "/dashboard/freelancer/messaging"
                ? "text-orange-500"
                : "hover:text-orange-500"
            }
          >
            Messaging
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
          <ThemeToggle />
          {/** //TODO : Change the user with dropdown */}
          {/** //TODO : Implement logout in the dropdown */}
          {/** //TODO : Add user settings in the dropdown */}
          {/* User (desktop only) */}
          <ProfileDropdown
            user={{
              id: 1,
              username: "Jane Doe",
              email: "jane.doe@example.com",
              role: "admin",
              status: "active",
              is_verified: true,
              created_at: "2023-01-01T00:00:00Z",
              avatar: "https://i.pravatar.cc/150?img=5",
            }}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
            onLogoutClick={() => console.log("Logout clicked")}
          />

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
