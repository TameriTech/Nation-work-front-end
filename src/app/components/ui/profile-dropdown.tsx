// app/components/profile-dropdown.tsx

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
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { UserRole } from "@/app/types";
import { Icon } from "@iconify/react";

export function ProfileDropdown() {
  const { user, logout, isLoggingOut, isLoading } = useAuth();
  const router = useRouter();

  // Gérer les états de chargement
  if (isLoading) {
    return (
      <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto">
        <Avatar className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="hidden md:flex flex-col items-start text-left">
          <span className="text-sm font-medium leading-none text-gray-400">Chargement...</span>
        </div>
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  // Fonctions de fallback pour les noms
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    if (user.first_name) {
      return user.first_name[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    if (user.email) return user.email.split('@')[0];
    return "User";
  };

  const getDropdownItems = () => {
    if (user.role === UserRole.PROVIDER) {
      return [
        { label: "My profile", icon: <Icon icon="ph:user" />, onClick: () => router.push('/dashboard/provider/profile') },
        { label: "Payments", icon: <Icon icon='ph:money' />, onClick: () => router.push('/dashboard/provider/profile/finances') },
        { label: "Mission History", icon: <Icon icon='ph:clock' />, onClick: () => router.push('/dashboard/provider/missions/history') },
        { label: "Favorites", icon: <Icon icon='ph:heart' />, onClick: () => router.push('/dashboard/provider/missions/favorites') },
        { label: "Reviews", icon: <Icon icon='ph:star' />, onClick: () => router.push('/dashboard/provider/profile/reviews') },
      ];
    }
    
    if (user.role === UserRole.CLIENT) {
      return [
        { label: "My profile", icon: <Icon icon="ph:user" />, onClick: () => router.push('/dashboard/customer/profile') },
        { label: "Settings", icon: <Icon icon="ph:gear" />, onClick: () => router.push('/settings') },
      ];
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      return [
        { label: "My Profile", icon: <Icon icon="ph:user" />, onClick: () => router.push('/dashboard/admin/profile') },
        { label: "Settings", icon: <Icon icon="ph:gear" />, onClick: () => router.push('/settings') },
        { label: "Admin Panel", icon: <Icon icon="ph:layout" />, onClick: () => router.push('/dashboard/admin') },
      ];
    }
    
    return [];
  };

  const dropdownItems = getDropdownItems();
  const initials = getInitials();
  const displayName = getDisplayName();

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 h-auto transition-colors",
            "bg-white dark:bg-slate-950",
            "text-gray-500 dark:text-gray-200",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "focus-visible:ring-1 focus-visible:ring-primary"
          )}
        >
          <Avatar className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
            <AvatarImage src={user.avatar} alt={displayName} />
            <AvatarFallback className="bg-primary text-white text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-medium leading-none text-text-primary dark:text-gray-100">
              {displayName}
            </span>
            <span className="text-xs text-text-secondary dark:text-gray-400 leading-none mt-0.5 capitalize">
              {user.role}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-text-secondary dark:text-gray-400 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-56 border shadow-lg",
          "bg-surface dark:bg-gray-900",
          "border-gray-100 dark:border-gray-700",
          "text-text-primary dark:text-gray-100"
        )}
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-text-primary dark:text-gray-100">
              {displayName}
            </p>
            <p className="text-xs leading-none text-text-secondary dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
        
        {dropdownItems && dropdownItems.length > 0 && (
          <>
            {dropdownItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className={cn(
                  "cursor-pointer transition-colors",
                  "hover:bg-primary/10 hover:text-primary",
                  "focus:bg-primary/10 focus:text-primary",
                  "dark:hover:bg-primary/20 dark:hover:text-primary",
                  "dark:focus:bg-primary/20 dark:focus:text-primary"
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
          </>
        )}
        
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "cursor-pointer transition-colors",
            "text-error hover:bg-error/10 hover:text-error",
            "focus:bg-error/10 focus:text-error",
            "dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-400",
            "dark:focus:bg-red-500/20 dark:focus:text-red-400"
          )}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Déconnexion..." : "Déconnexion"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}