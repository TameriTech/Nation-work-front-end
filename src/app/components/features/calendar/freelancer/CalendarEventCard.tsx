import { Badge } from "@/app/components/ui/badge";
import { Icon } from "@iconify/react";

export type EventStatus = "completed" | "published" | "upcoming" | "assigned";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  price: number;
  status: EventStatus;
  avatarUrl?: string;
  avatarFallback?: string;
}

interface CalendarEventCardProps {
  event: CalendarEvent;
}

const statusConfig = {
  completed: {
    label: "Terminé",
    icon: "bi:check",
    borderClass: "border-green-500",
    bgClass: "bg-green-100",
    badgeClass: "bg-green-100 text-green-500 border-green-500",
    priceClass: "text-green-500",
  },
  published: {
    label: "Publié",
    icon: "bi:circle",
    borderClass: "border-blue-500",
    bgClass: "bg-blue-100",
    badgeClass: "bg-blue-100 text-blue-500 border-blue-500",
    priceClass: "text-blue-500",
  },
  upcoming: {
    label: "À venir",
    icon: "bi:clock",
    borderClass: "border-yellow-500",
    bgClass: "bg-yellow-100",
    badgeClass: "bg-yellow-100 text-yellow-500 border-yellow-500",
    priceClass: "text-yellow-500",
  },
  assigned: {
    label: "Assigné",
    icon: "bi:x",
    borderClass: "border-red-500",
    bgClass: "bg-red-100",
    badgeClass: "bg-red-100 text-red-500 border-red-500",
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
      className={`h-full w-full rounded-r-[20px] border-l-2 border-r-0 ${config.borderClass} ${config.bgClass} p-3 overflow-hidden`}
    >
      <div className="space-y-1 flex-col items-start gap-2">
        <p className="text-[8px] text-gray-500">
          {formatTime(event.start)} – {formatTime(event.end)}
        </p>
        <p className="font-medium text-[9px] text-gray-800 truncate">
          {event.title}
        </p>
        <p className="text-[8px] text-gray-700">intitulé de la prestation</p>
        <Badge
          variant="outline"
          className={`${config.badgeClass} text-xs font-medium px-2 py-0.5 mb-1`}
        >
          <Icon icon={StatusIcon} className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      </div>
    </div>
  );
}
