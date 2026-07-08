// src/app/types/support/ticket.ts
import { TicketStatus, TicketPriority, TicketCategory } from '../enums';

export interface TicketCreate {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
  attachments?: string[];
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export interface TicketUpdate {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: number;
  notes?: string;
}

export interface TicketResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: number;
  assignedToName?: string;
  attachments?: string[];
  relatedEntityId?: number;
  relatedEntityType?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  message: string;
  attachments?: string[];
  isInternal: boolean;
  createdAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  averageResponseTime: number;
  averageResolutionTime: number;
}
