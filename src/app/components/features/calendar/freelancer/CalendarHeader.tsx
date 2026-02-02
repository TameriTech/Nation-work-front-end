import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Icon } from "@iconify/react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showPublishServiceButton?: boolean;
}

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const getWeekNumber = (date: Date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
};

const getMonthStart = (date: Date) => {
  const day = date.getDate();
  return day;
};

export function CalendarHeader({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onPrevMonth,
  onNextMonth,
  showPublishServiceButton,
}: CalendarHeaderProps) {
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const prevMonthIndex =
    currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
  const nextMonthIndex =
    currentDate.getMonth() === 11 ? 0 : currentDate.getMonth() + 1;

  return (
    <div className="space-y-4 text-gray-600">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-primary">
          Calendrier de prestation
        </h1>
        <div className="flex items-center gap-3">
          {showPublishServiceButton && (
            <Button className="bg-orange-500 hover:bg-orange-500/90 text-white rounded-full px-6">
              <Icon icon={"bi:plus"} className="h-4 w-4 mr-2" />
              Publier un service sur Nation Work
            </Button>
          )}

          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] rounded-full bg-white border-border">
              <SelectValue placeholder="Filtre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Terminé/A venir/Annulé</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="upcoming">À venir</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="2025">
            <SelectTrigger className="w-[100px] rounded-full bg-transparent border-border">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <Icon icon={"bi:chevron-left"} className="h-5 w-5 text-slate-400" />
          </button>
          <span className="text-sm text-slate-400">
            Semaine du {getMonthStart(currentDate)}
          </span>
          <span className="text-lg font-semibold text-primary">
            {currentMonth} {currentYear}
          </span>
          <span className="text-sm text-slate-400">Semaine du 30</span>
          <button
            onClick={onNextWeek}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <Icon
              icon={"bi:chevron-right"}
              className="h-5 w-5 text-slate-400"
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <Icon icon={"bi:chevron-left"} className="h-5 w-5 text-slate-400" />
          </button>
          <span className="text-sm text-slate-400">
            {months[prevMonthIndex]}
          </span>
          <span className="text-sm text-foreground font-medium">
            {months[nextMonthIndex]}
          </span>
          <button
            onClick={onNextMonth}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <Icon
              icon={"bi:chevron-right"}
              className="h-5 w-5 text-slate-400"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
