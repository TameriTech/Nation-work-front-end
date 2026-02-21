"use client";

import { logout } from "@/app/services/auth.service";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../../theme-toggle";
import { ProfileDropdown } from "../../ui/profile-dropdown";

interface HeaderProps {
  title?: string;
  //date?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onMenuClick?: () => void;
}

export function Header({
  title = "DASHBOARD",
  //date = new Date().toLocaleDateString("fr-FR"),
  userName = "Cali Biba",
  userRole = "Etudiante / Ménagère",
  userAvatar,
  onMenuClick,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<string | null>(null);
  //const [date] = useState(new Date().toLocaleDateString("fr-FR"));

  useEffect(() => {
    setDate(new Date().toLocaleDateString("fr-FR"));
  }, []);

  return (
    <header className="flex gap-3 md:flex-row md:items-center md:justify-between justify-between">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Burger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-full bg-white border border-blue-900"
        >
          <Icon icon="bx:chevron-right" className="text-xl text-blue-900 " />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search (hidden on very small screens) */}
        <div className="hidden sm:flex relative">
          <input
            className="bg-white rounded-full px-4 py-2 text-sm w-56"
            placeholder="Recherche"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Icon
            icon="bx:search"
            className="absolute right-3 top-2.5 text-blue-900"
          />
        </div>

        <button className="p-2 rounded-full border border-blue-900 text-blue-900 bg-white">
          <Icon icon="bx:help-circle" />
        </button>

        <button
          onClick={() => logout()}
          className="p-2 rounded-full hover:cursor-pointer border border-blue-900 text-blue-900 bg-white"
        >
          <Icon icon="bi:bell" />
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
      </div>
    </header>
  );
}
