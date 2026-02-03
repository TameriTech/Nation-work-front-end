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

