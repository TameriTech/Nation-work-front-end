import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { CalendarEvent } from "@/app/types/calender-events";
import { Icon } from "@iconify/react";

interface CalendarEventCardProps {
  event: CalendarEvent;
}

const statusConfig = {
  completed: {
    label: "Terminé",
    icon: "bi:check",
    borderClass: "border-green-500",
    bgClass: "bg-green-100",
    badgeClass: "bg-green-200 text-green-700 border-green-500",
    priceClass: "text-green-500",
  },
  published: {
    label: "Publié",
    icon: "bi:circle",
    borderClass: "border-blue-500",
    bgClass: "bg-blue-100",
    badgeClass: "bg-blue-200 text-blue-700 border-blue-500",
    priceClass: "text-blue-500",
  },
  upcoming: {
    label: "À venir",
    icon: "bi:clock",
    borderClass: "border-yellow-500",
    bgClass: "bg-yellow-100",
    badgeClass: "bg-yellow-200 text-yellow-700 border-yellow-500",
    priceClass: "text-yellow-500",
  },
  assigned: {
    label: "Assigné",
    icon: "bi:x",
    borderClass: "border-red-500",
    bgClass: "bg-red-100",
    badgeClass: "bg-red-200 text-red-700 border-red-500",
    priceClass: "text-red-500",
  },
};

const formatTime = (date: Date) => {
  return date
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR").format(price) + " ₦";
};

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  const config = statusConfig[event.status];
  const StatusIcon = config.icon;

  return (
    <div
      className={`h-fit w-[120px]  rounded-[20px] border-2 ${config.borderClass} ${config.bgClass} px-2.5 py-1 overflow-hidden`}
    >
      <div className="flex items-start gap-1">
        <Avatar className="h-7 w-7 shrink-0 rounded-[10px]">
          <AvatarImage src={event.avatarUrl} alt="Avatar" />
          <AvatarFallback className="bg-muted text-slate-400 text-xs">
            {event.avatarFallback || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <Badge
            variant="outline"
            className={`${config.badgeClass} text-[8px] font-medium px-2 py-0.5 mb-1`}
          >
            <Icon icon={StatusIcon} className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
          <p className="text-[7px] text-gray-500">
            {formatTime(event.start)} – {formatTime(event.end)}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className="font-medium text-[9px] text-gray-800 truncate">
          {event.title}
        </p>
        <p className="text-[8px] text-gray-500">
          {formatTime(event.start)} - {formatTime(event.end)}
        </p>
        <p
          className={`font-bold text-[9px] text-gray-900 mt-1 ${config.priceClass}`}
        >
          {formatPrice(event.price)}
        </p>
      </div>
    </div>
  );
}
