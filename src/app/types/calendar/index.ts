import { EventStatus } from "../services/service";

// ============================================================================
// TYPES POUR LE CALENDRIER
// ============================================================================

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
