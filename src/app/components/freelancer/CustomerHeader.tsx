import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";

interface CustomerHeaderProps {
  userName?: string;
  userAvatar?: string;
}

export function CustomerHeader({
  userName = "Cali Biba",
  userAvatar,
}: CustomerHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground font-medium"
          >
            <Icon icon={"bi:search"} className="h-4 w-4 mr-2" />
            Trouver une offre
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground font-medium"
          >
            <Icon icon={"bi:calendar"} className="h-4 w-4 mr-2" />
            Agenda
          </Button>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon icon={"bi:bell"} className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border/40">
            <Avatar className="h-9 w-9">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-sm font-medium text-foreground">
                {userName}
              </span>
              <Icon
                icon={"bi:chevron-down"}
                className="h-4 w-4 text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
