import { Bell, Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Breadcrumbs } from "@/app/components/ui/breadcrumbs";
import { ProfileDropdown } from "@/app/components/ui/profile-dropdown";
import type { HeaderProps } from "@/app/types/admin";
import { cn } from "@/app/lib/utils";
// Dummy user data for the profile dropdown
const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  role: "Administrator",
};

export function Header({
  onMenuClick,
  breadcrumbConfig,
  notificationCount = 0,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-gray-300/10 bg-slate-950 px-4 backdrop-blur md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden"
        onClick={onMenuClick}
        aria-label="Toggle sidebar menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumbs config={breadcrumbConfig} className="hidden sm:flex" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications${
            notificationCount > 0 ? ` (${notificationCount} unread)` : ""
          }`}
        >
          <Bell className="h-5 w-5 text-slate-400" />
          {notificationCount > 0 && (
            <span
              className={cn(
                "absolute right-1.5 top-1.5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground",
                notificationCount > 9
                  ? "h-5 min-w-5 px-1 text-[10px]"
                  : "h-4 w-4 text-[10px]"
              )}
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </Button>

        {/* Separator */}
        <div className="hidden h-6 w-px bg-border md:block" />

        {/* Profile */}
        <ProfileDropdown
          user={user}
          onProfileClick={() => console.log("Profile clicked")}
          onSettingsClick={() => console.log("Settings clicked")}
          onLogoutClick={() => console.log("Logout clicked")}
        />
      </div>
    </header>
  );
}
