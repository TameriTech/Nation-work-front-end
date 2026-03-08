import { Service } from "../services/service";
import { User } from "../auth/user";
import { Message } from "./message";

// ============================================================================
// TYPES POUR LES CONVERSATIONS
// ============================================================================

export interface Conversation {
  id: number;
  service_id: number;
  client_id: number;
  freelancer_id: number;
  is_active: boolean;
  is_typing?: boolean;
  is_read?: boolean;
  last_message_at?: string;
  created_at: string;
  updated_at?: string;
  
  // Relations
  sender?: User;
  recipient?: User;
  service?: Service;
  client?: User;
  freelancer?: User;
  admin?: User;
  
  unread_count: number;
  last_message: Message | null;
  message_count?: number;
}

export interface ConversationFilters {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  is_active?: boolean;
  participant_type?: 'client' | 'freelancer' | 'admin';
  date_from?: string;
  date_to?: string;
}

export interface ConversationStats {
  total: number;
  active: number;
  archived: number;
  unread: number;
  total_messages: number;
  avg_messages_per_conversation: number;
  participants: number;
  engagement_rate: number;
}

export interface CreateConversationPayload {
  service_id: number;
  client_id: number;
  freelancer_id: number;
}

export interface TypingIndicator {
  conversation_id: number;
  user_id: number;
  is_typing: boolean;
}
