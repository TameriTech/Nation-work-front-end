// ============================================================================
// TYPES POUR LE SUPPORT
// ============================================================================

export interface SupportTicket {
  id: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  status: 'open' | 'in_progress' | 'closed' | 'resolved';
  created_at: string;
  assigned_to?: string;
  assigned_at?: string;
  closed_at?: string;
  resolution?: string;
  messages?: Array<{
    from: string;
    message: string;
    timestamp: string;
  }>;
}

export interface TicketStats {
  open: number;
  in_progress: number;
  closed: number;
  by_priority: {
    low: number;
    normal: number;
    high: number;
  };
  by_category: Record<string, number>;
  average_resolution_time: string;
}

export interface TicketHistoryEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}
