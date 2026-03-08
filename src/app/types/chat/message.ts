import { User } from "../auth/user";

// ============================================================================
// TYPES POUR LES MESSAGES
// ============================================================================

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  recipient_id: number;
  content?: string;
  media_url?: string[];
  media_type: "text" | "image" | "file" | "mixed";
  is_read: boolean;
  is_sent: boolean;
  read_at?: string;
  is_delivered: boolean;
  delivered_at?: string;
  created_at: string;
  
  // Relations
  sender?: User;
  recipient?: User;
}

export interface CreateMessagePayload {
  conversation_id: number;
  content?: string;
  media_url?: string[];
  media_type: "text" | "image" | "file" | "mixed";
}
