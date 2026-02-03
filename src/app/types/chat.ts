import { Service } from "./services";
import { User } from "./user";

export interface Conversation {
  id: number;
  service_id: number;
  is_active: boolean;
  is_typing?: boolean;
  is_read?: boolean;
  created_at: string;
  last_message_at: string;

  sender: User;
  recipient: User;
  service: Service;

  unread_count: number;
  last_message: Message | null;
}

  
export interface Message {
  id: number;
  conversation_id: number;

  sender: User;
  recipient: User;

  content: string;
  media_url: string[];
  media_type: "text" | "image" | "file" | "mixed";

  is_read: boolean;
  is_sent: boolean;
  read_at: string | null;
  created_at: string;
}



export interface CreateConversationPayload {
  service_id: number;
  client_id: number;
  freelancer_id: number;
}


export interface CreateMessagePayload {
  conversation_id: number;
  content?: string;
  media_url?: string[];
  media_type: "text" | "image" | "file" | "mixed";
}