"use client";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  title?: string;
  date?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export default function Header({
  title = "DASHBOARD",
  date = new Date().toLocaleDateString("fr-FR"),
  userName = "Cali Biba",
  userRole = "Etudiante / Ménagère",
  userAvatar,
}: HeaderProps) {
  const page = usePathname.name;
  return (
    <header className="w-full sticky top-0 p-2.5 rounded-[30px] bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">
          <img src="/icons/logo-text.png" alt="Logo" className="h-14" />
        </h1>
        <nav className="hidden md:flex gap-6 font-medium text-gray-700 text-base">
          <a
            href="/dashboard/freelancer"
            className={
              page == "/dashboard/freelancer"
                ? "text-orange-500"
                : "hover:text-orange-500"
            }
          >
            Votre profile
          </a>
          <a
            href="/dashboard/freelancer/jobs"
            className={"hover:text-orange-500"}
          >
            Trouver une offre
          </a>
          <a href="#" className="hover:text-orange-500">
            Agenda
          </a>
        </nav>
        <div className="col-span-8 flex items-center justify-end gap-3">
          {/* Icon buttons */}
          <button className="p-2 rounded-full border bg-white border-[#69BBFF] text-blue-900 hover:cursor-pointer transition-colors">
            <Icon icon={"bx:help-circle"} className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full border bg-white border-[#69BBFF] text-blue-900 hover:cursor-pointer transition-colors">
            <Icon icon={"bi:bell"} className="h-5 w-5" />
          </button>

          {/* User avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-primary-foreground">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="text-lg w-10 h-10 flex items-center justify-center font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex flex-col min-w-fit">
            <span className="text-sm font-medium text-gray-800">
              {userName}
            </span>
            <span className="text-xs text-gray-500">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
