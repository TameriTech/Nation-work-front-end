// ==================== CONVERSATION TYPES ====================

import z from "zod";
import { MediaType, MessageStatus, MessageType, ReactionType } from "../enums";
import { Mission } from "../missions";
import { User } from "../auth";

// types/chat.ts

export interface AdminConversationDetailResponse {
  conversation: {
    id: number;
    service_id: number;
    client_id: number;
    provider_id: number;
    is_active: boolean;
    last_message_at: string | null;
    created_at: string;
    updated_at: string | null;
    client_name: string | null;
    client_avatar: string | null;
    client_email: string | null;
    provider_name: string | null;
    provider_avatar: string | null;
    provider_email: string | null;
    service_title: string | null;
    service_code: string | null;
    service_status: string | null;
    unread_count: number;
    total_messages: number;
    last_message_preview: string | null;
    last_message_time: string | null;
    last_message_sender: string | null;
  };
  messages: AdminMessageResponse[];
  client: {
    id: number;
    username: string;
    full_name: string | null;
    avatar: string | null;
    email: string;
    phone: string | null;
    role: string;
  } | null;
  provider: {
    id: number;
    username: string;
    full_name: string | null;
    avatar: string | null;
    email: string;
    phone: string | null;
    role: string;
    rating: number | null;
  } | null;
  service: {
    id: number;
    title: string;
    code: string;
    slug: string;
    status: string | null;
    proposed_amount: number;
    city: string | null;
    scheduled_date: string | null;
    client_id: number;
    provider_id: number | null;
  } | null;
}

export interface AdminMessageResponse {
  id: number;
  content: string | null;
  time: string;
  is_sent: boolean;
  is_read: boolean;
  is_delivered: boolean;
  status: string;
  attachments: AttachmentResponse[];
  sender_id: number | null;
  sender_name: string;
  sender_avatar: string | null;
  sender_role: string | null;
  message_type: string;
  is_system: boolean;
  reactions: Record<string, number[]>;
  user_reaction: string | null;
  reply_to: number | null;
  reply_preview: string | null;
  created_at: string | null;
}

export interface AttachmentResponse {
  url: string;
  type: string;
  name: string;
  size: number;
  mime_type: string | null;
}

export interface ConversationDetailResponse {
  id: number;
  service_id: number;
  client_id: number;
  provider_id: number;
  is_active: boolean;
  last_message_at?: string;
  created_at: string;
  updated_at?: string;
  
  // Joined fields
  client_name?: string;
  client_avatar?: string;
  provider_name?: string;
  provider_avatar?: string;
  service_title?: string;
  service_code?: string;
  service_status?: string;
  
  // For current user view
  other_user_name?: string;
  other_user_avatar?: string;
  other_user_id?: number;
  
  // Stats
  unread_count: number;
  total_messages: number;
  last_message_preview?: string;
  last_message_time?: string;
  last_message_sender?: string;
}

export interface ConversationListResponse {
  id: number;
  name: string;
  avatar?: string;
  lastMessage?: {
    content?: string;
    created_at?: string;
    sender_name?: string;
    is_read?: boolean;
  };
  lastMessageTime?: string;
  lastMessageSender?: string;
  unreadCount: number;
  isRead: boolean;
  is_active: boolean;
  
  // Service context
  service_id?: number;
  service_title?: string;
  service_code?: string;
  service_status?: string;
  
  // Participant info
  client_id?: number;
  client_name?: string;
  client_avatar?: string;
  provider_id?: number;
  provider_name?: string;
  provider_avatar?: string;
  other_user_id?: number;
  other_user_name?: string;
  other_user_avatar?: string;
  other_user_role?: string;
  
  // Nested objects (fallback)
  service?: Service;
  client?:User;
  provider?: User;
}

export interface ConversationFilters {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  participant_type?: "client" | "provider" | "admin";
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface ConversationStats {
  total_conversations: number;
  active_conversations: number;
  total_messages: number;
  unread_count: number;
  engagement_rate: number;
  participants: number;
  archived_conversations: number;
}

export interface ConversationDetail {
  id: number;
  conversation: ConversationDetailResponse;
  messages: MessageListResponse[];
  other_user: Record<string, any>;
  service: Service;
}


// ==================== MESSAGE TYPES ====================

export const AttachmentSchema = z.object({
  url: z.string().url(),
  type: z.enum(['image', 'video', 'audio', 'document', 'file', 'code', 'spreadsheet', 'presentation', 'archive']),
  name: z.string(),
  size: z.number(),
  mime_type: z.string().optional()
});

// Dériver le type TypeScript depuis Zod → plus de désynchronisation possible
export type Attachment = z.infer<typeof AttachmentSchema>;

export interface MessageCreateSimple {
  content?: string | null;
  attachments?: Attachment[];
  message_type?: string;
  reply_to?: number | null;
}

export interface MessageListResponse {
  id: number;
  content?: string;
  time: string;
  is_sent: boolean;
  is_delivered: boolean;
  is_read: boolean;
  status: string;
  attachments: Attachment[];
  sender_id: number;
  sender_name?: string;
  sender_avatar?: string;
  message_type: string;
  is_system: boolean;
  reactions: Record<string, number[]>;
  user_reaction?: string;
  reply_to?: number;
  reply_preview?: string;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  recipient_id: number;
  content?: string;
  attachments: Attachment[];
  message_type: string;
  is_read: boolean;
  read_at?: string;
  is_delivered: boolean;
  delivered_at?: string;
  created_at: string;
  
  // Joined fields
  sender_name?: string;
  sender_avatar?: string;
  sender_role?: string;
  recipient_name?: string;
}

export interface MessageReaction {
  reaction: ReactionType;
}

export interface MessageReactionResponse {
  message_id: number;
  reactions: Record<string, number[]>;
  user_reaction?: string;
}

export interface MessageReadReceipt {
  message_id: number;
  read_at: string;
}

// ==================== TYPING INDICATOR ====================

export interface TypingIndicator {
  conversation_id: number;
  user_id: number;
  is_typing: boolean;
}

// ==================== STATISTICS ====================

export interface ChatStats {
  total_conversations: number;
  total_messages: number;
  unread_messages: number;
  active_conversations: number;
  messages_sent: number;
  messages_received: number;
  average_response_time_minutes?: number;
  messages_today: number;
  messages_this_week: number;
  most_active_conversation?: number;
}

// ==================== SEARCH ====================

export interface MessageSearchResult {
  message_id: number;
  content?: string;
  created_at: string;
  conversation_id: number;
  conversation_title: string;
  service_id: number;
  service_title: string;
  sender_id: number;
  sender_name: string;
  is_sent_by_me: boolean;
  match_preview: string;
}

export interface MessageSearchResponse {
  query: string;
  count: number;
  results: MessageSearchResult[];
}

// ==================== UPLOAD ====================

export interface FileUploadResponse {
  success: boolean;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: AttachmentType;
  mime_type?: string;
  original_filename: string;
  optimized: boolean;
  created_at?: string;
}

// ==================== MEDIA CONFIG ====================

export interface MediaConfig {
  maxTotalSize: number;
  maxFilesPerMessage: number;
  types: Record<string, {
    maxSize: number;
    allowedExtensions: string[];
    allowedMimeTypes: string[];
    canPreview: boolean;
  }>;
}

// ==================== WEB SOCKET ====================

export interface ChatEvent {
  event_type: 'new_message' | 'message_read' | 'typing' | 'reaction' | 'user_disconnected' | 'conversation_read';
  conversation_id: number;
  user_id: number;
  timestamp: string;
  data: Record<string, any>;
}

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

// ==================== FILTERS ====================

export interface MessageFilters {
  limit?: number;
  before_id?: number;
  after_id?: number;
  message_type?: MessageType;
  include_system?: boolean;
}

// ==================== PAGINATED RESPONSE ====================

export interface UnreadCountResponse {
  total: number;
  by_conversation: Record<number, number>;
}

