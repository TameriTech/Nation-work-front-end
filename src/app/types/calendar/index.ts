// src/app/types/calendar/index.ts
import { TimeSlot, ViewType } from '../enums';

export interface CalendarEvent {
  id: number;
  serviceId: number;
  title: string;
  shortDescription?: string;
  startTime: string;
  endTime: string;
  startFormatted: string;
  endFormatted: string;
  timeDisplay: string;
  duration: string;
  durationHours: number;
  status: string;
  statusDisplay: string;
  statusColor: string;
  otherPartyId?: number;
  otherPartyName?: string;
  otherPartyAvatar?: string;
  otherPartyRole?: string;
  address?: string;
  city?: string;
  location?: string;
  price: number;
  priceFormatted: string;
  isUrgent: boolean;
  isFeatured: boolean;
}

export interface CalendarDay {
  date: string;
  dayName: string;
  dayShort: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
  eventCount: number;
  hasEvents: boolean;
}

export interface CalendarDayPreview {
  date: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  eventCount: number;
  hasEvents: boolean;
  eventPreviews?: Array<{ id: number; title: string; status: string; statusColor: string; time: string }>;
  additionalCount?: number;
}

export interface WeekCalendar {
  viewType: string;
  weekStart: string;
  weekEnd: string;
  currentDate: string;
  days: CalendarDay[];
  metrics: Record<string, any>;
  totalEvents: number;
  navigation: {
    prevWeek: string;
    nextWeek: string;
    prevWeekStart: string;
    nextWeekStart: string;
  };
}

export interface MonthCalendar {
  viewType: string;
  year: number;
  month: number;
  monthName: string;
  startDate: string;
  endDate: string;
  calendarGrid: Array<Array<CalendarDayPreview | null>>;
  metrics: Record<string, any>;
  totalEvents: number;
  navigation: {
    prevMonth: { year: number; month: number };
    nextMonth: { year: number; month: number };
  };
}

export interface DayCalendar {
  viewType: string;
  date: string;
  dayName: string;
  isToday: boolean;
  events: CalendarEvent[];
  eventCount: number;
  grouped: {
    morning: CalendarEvent[];
    afternoon: CalendarEvent[];
    evening: CalendarEvent[];
  };
  metrics: {
    morningCount: number;
    afternoonCount: number;
    eveningCount: number;
  };
}

export interface AgendaItem {
  date: string;
  dayName: string;
  dayShort: string;
  monthDay: string;
  isToday: boolean;
  events: CalendarEvent[];
  eventCount: number;
}

export interface AgendaView {
  viewType: string;
  startDate: string;
  endDate: string;
  daysAhead: number;
  agenda: AgendaItem[];
  totalEvents: number;
}

export interface CalendarMetrics {
  today: number;
  upcoming: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  thisWeek: number;
  nextWeek: number;
  total: number;
}

export interface AvailabilityCheck {
  providerId: number;
  startDatetime: string;
  durationHours: number;
  excludeServiceId?: number;
}

export interface AvailabilityResponse {
  providerId: number;
  startDatetime: string;
  durationHours: number;
  isAvailable: boolean;
  reason?: string;
}

export interface providerAvailabilityDay {
  date: string;
  dayName: string;
  isWorkingDay: boolean;
  workingHours?: { start: string; end: string };
  availableSlotsCount: number;
  availableSlots: TimeSlot[];
}

export interface providerAvailabilityWeek {
  providerId: number;
  weekStart: string;
  weekEnd: string;
  days: providerAvailabilityDay[];
}

export interface CalendarFilter {
  view: ViewType;
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
  status?: string[];
  role: string;
}
