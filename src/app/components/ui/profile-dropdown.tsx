import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import type { ProfileDropdownProps } from "@/app/types/admin";

export function ProfileDropdown({
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}: ProfileDropdownProps) {
  const initials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center bg-white dark:bg-slate-950 text-gray-500 dark:text-gray-200  gap-2 px-2 py-1.5 h-auto hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-medium leading-none">
              {user.username}
            </span>
            <span className="text-xs text-slate-400 leading-none mt-0.5">
              {user.role}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-popover border-border shadow-lg bg-white dark:bg-slate-950 dark:border-slate-800 text-gray-500 dark:text-gray-200"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-slate-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onProfileClick}
          className="cursor-pointer focus:bg-accent"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onSettingsClick}
          className="cursor-pointer focus:bg-accent"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogoutClick}
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
