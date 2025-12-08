"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  date?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export function Header({
  title = "DASHBOARD",
  date = new Date().toLocaleDateString("fr-FR"),
  userName = "Cali Biba",
  userRole = "Etudiante / Ménagère",
  userAvatar,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="grid grid-cols-12 items-center gap-4 bg-transparent text-black py-4">
      {/* Left section: Title and date */}
      <div className="col-span-4 flex flex-col">
        <h1 className="text-lg font-bold text-gray-800 tracking-wide">
          {title}
        </h1>
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      {/* Right section: Icons and user profile */}
      <div className="col-span-8 flex items-center justify-end gap-3">
        {/* Search bar */}
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="Effectuer une recherche"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 rounded-[50px] text-sm py-2 pr-10 pl-4 focus:outline-none transition-colors"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon icon={"bx:x"} className="text-2xl mr-5 text-blue-900" />
            </button>
          ) : null}
          <Icon
            icon={"bx:search"}
            className="absolute right-2 h-8 w-8 text-blue-900"
          />
        </div>
        {/* Icon buttons */}
        <button className="p-2 rounded-full border bg-white border-blue-900 text-blue-900 hover:cursor-pointer transition-colors">
          <Icon icon={"bx:help-circle"} className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full border bg-white border-blue-900 text-blue-900 hover:cursor-pointer transition-colors">
          <Icon icon={"bi:bell"} className="h-5 w-5" />
        </button>

        {/* User avatar */}
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary-foreground">
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
          <span className="text-sm font-medium text-gray-800">{userName}</span>
          <span className="text-xs text-gray-500">{userRole}</span>
        </div>
      </div>
    </header>
  );
}
