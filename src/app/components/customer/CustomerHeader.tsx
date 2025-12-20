"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  date?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onMenuClick?: () => void;
}

export function Header({
  title = "DASHBOARD",
  date = new Date().toLocaleDateString("fr-FR"),
  userName = "Cali Biba",
  userRole = "Etudiante / Ménagère",
  userAvatar,
  onMenuClick,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

        <button className="p-2 rounded-full border border-blue-900 text-blue-900 bg-white">
          <Icon icon="bi:bell" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-white border-blue-900 text-blue-900 flex items-center justify-center">
            {userAvatar ? (
              <img src={userAvatar} className="h-full w-full rounded-full" />
            ) : (
              userName[0]
            )}
          </div>

          <div className="hidden md:flex flex-col">
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
