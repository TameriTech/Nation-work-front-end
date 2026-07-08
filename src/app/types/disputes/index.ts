// src/app/types/dispute.ts

import { User } from "../auth";
import { Mission } from "../missions/mission";

export interface Dispute {
  id: string;
  title: string;
  description: string;
  reason: string;
  status: 'open' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  service_id?: string;
  service?: Mission;
  client_id: string;
  provider_id: string;
  client?: User;
  provider?: User;
  message_count: number;
  created_at: string;
  updated_at: string;
}
