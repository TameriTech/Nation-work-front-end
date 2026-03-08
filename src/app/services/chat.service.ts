// src/app/services/messages.service.ts

import type { 
  Conversation, 
  Message, 
  ConversationFilters, 
  PaginatedResponse,
  ConversationStats,
  TypingIndicator
} from "@/app/types";
import { handleResponse } from "@/app/lib/error-handler";

// ==================== CONVERSATIONS ====================

/**
 * Récupère la liste des conversations avec filtres
 */
export async function getConversations(filters?: ConversationFilters): Promise<PaginatedResponse<Conversation>> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/chat/conversations?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<PaginatedResponse<Conversation>>(res);
  } catch (error) {
    console.error("Erreur getConversations:", error);
    throw error;
  }
}

/**
 * Récupère les statistiques des conversations
 */
export async function getConversationStats(): Promise<ConversationStats> {
  try {
    const res = await fetch("/api/chat/conversations/stats", {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<ConversationStats>(res);
  } catch (error) {
    console.error("Erreur getConversationStats:", error);
    throw error;
  }
}

/**
 * Récupère une conversation spécifique par son ID
 */
export async function getConversationById(id: number): Promise<Conversation> {
  try {
    const res = await fetch(`/api/chat/conversations/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<Conversation>(res);
  } catch (error) {
    console.error(`Erreur getConversationById ${id}:`, error);
    throw error;
  }
}

/**
 * Crée une nouvelle conversation
 */
export async function createConversation(data: {
  service_id: number;
  client_id: number;
  freelancer_id: number;
  initial_message?: string;
}): Promise<Conversation> {
  try {
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<Conversation>(res);
  } catch (error) {
    console.error("Erreur createConversation:", error);
    throw error;
  }
}

/**
 * Met à jour une conversation (archivage/désarchivage)
 */
export async function updateConversation(
  id: number, 
  data: Partial<Conversation>
): Promise<Conversation> {
  try {
    const res = await fetch(`/api/chat/conversations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<Conversation>(res);
  } catch (error) {
    console.error(`Erreur updateConversation ${id}:`, error);
    throw error;
  }
}

/**
 * Archive ou désarchive une conversation
 */
export async function archiveConversation(id: number, archive: boolean): Promise<Conversation> {
  return updateConversation(id, { is_active: !archive });
}

/**
 * Supprime une conversation
 */
export async function deleteConversation(id: number): Promise<void> {
  try {
    const res = await fetch(`/api/chat/conversations/${id}`, {
      method: "DELETE",
    });

    await handleResponse<{ success: boolean }>(res);
  } catch (error) {
    console.error(`Erreur deleteConversation ${id}:`, error);
    throw error;
  }
}

// ==================== MESSAGES ====================

/**
 * Récupère les messages d'une conversation
 */
export async function getMessages(
  conversationId: number,
  params?: {
    page?: number;
    limit?: number;
    before?: string;
    after?: string;
  }
): Promise<PaginatedResponse<Message>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/chat/conversations/${conversationId}/messages?${queryParams.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<PaginatedResponse<Message>>(res);
  } catch (error) {
    console.error(`Erreur getMessages ${conversationId}:`, error);
    throw error;
  }
}

/**
 * Envoie un nouveau message
 */
export async function sendMessage(data: {
  conversation_id: number;
  content?: string;
  media?: File;
  media_type?: string;
}): Promise<Message> {
  try {
    const formData = new FormData();
    formData.append("conversation_id", String(data.conversation_id));
    
    if (data.content) {
      formData.append("content", data.content);
    }
    
    if (data.media) {
      formData.append("media", data.media);
      if (data.media_type) {
        formData.append("media_type", data.media_type);
      }
    }

    const res = await fetch(`/api/chat/conversations/${data.conversation_id}/messages`, {
      method: "POST",
      body: formData,
    });

    return await handleResponse<Message>(res);
  } catch (error) {
    console.error("Erreur sendMessage:", error);
    throw error;
  }
}

/**
 * Upload un fichier média pour un message
 */
export async function uploadMessageMedia(
  conversationId: number,
  file: File
): Promise<{ url: string; type: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/chat/conversations/${conversationId}/upload`, {
      method: "POST",
      body: formData,
    });

    return await handleResponse<{ url: string; type: string }>(res);
  } catch (error) {
    console.error(`Erreur uploadMessageMedia ${conversationId}:`, error);
    throw error;
  }
}

/**
 * Marque un message comme lu
 */
export async function markMessageAsRead(messageId: number): Promise<Message> {
  try {
    const res = await fetch(`/api/chat/messages/${messageId}/read`, {
      method: "POST",
    });

    return await handleResponse<Message>(res);
  } catch (error) {
    console.error(`Erreur markMessageAsRead ${messageId}:`, error);
    throw error;
  }
}

/**
 * Marque tous les messages d'une conversation comme lus
 */
export async function markConversationAsRead(conversationId: number): Promise<{ count: number }> {
  try {
    const res = await fetch(`/api/chat/conversations/${conversationId}/read`, {
      method: "POST",
    });

    return await handleResponse<{ count: number }>(res);
  } catch (error) {
    console.error(`Erreur markConversationAsRead ${conversationId}:`, error);
    throw error;
  }
}

/**
 * Supprime un message
 */
export async function deleteMessage(messageId: number): Promise<void> {
  try {
    const res = await fetch(`/api/chat/messages/${messageId}`, {
      method: "DELETE",
    });

    await handleResponse<{ success: boolean }>(res);
  } catch (error) {
    console.error(`Erreur deleteMessage ${messageId}:`, error);
    throw error;
  }
}

// ==================== NOTIFICATIONS ====================

/**
 * Récupère le nombre de messages non lus
 */
export async function getUnreadCount(): Promise<{ total: number; by_conversation: Record<number, number> }> {
  try {
    const res = await fetch("/api/chat/messages/unread/count", {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<{ total: number; by_conversation: Record<number, number> }>(res);
  } catch (error) {
    console.error("Erreur getUnreadCount:", error);
    throw error;
  }
}

/**
 * Récupère les conversations avec messages non lus
 */
export async function getUnreadConversations(): Promise<Conversation[]> {
  try {
    const res = await fetch("/api/chat/conversations/unread", {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<Conversation[]>(res);
  } catch (error) {
    console.error("Erreur getUnreadConversations:", error);
    throw error;
  }
}

// ==================== RECHERCHE ====================

/**
 * Recherche dans les messages
 */
export async function searchMessages(
  query: string, 
  filters?: {
    conversation_id?: number;
    user_id?: number;
    date_from?: string;
    date_to?: string;
  }
): Promise<Message[]> {
  try {
    const params = new URLSearchParams({ query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/chat/messages/search?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<Message[]>(res);
  } catch (error) {
    console.error("Erreur searchMessages:", error);
    throw error;
  }
}

// ==================== UTILS (PAS D'APPELS API) ====================

/**
 * Formate une date pour l'affichage des messages
 */
export function formatMessageDate(date: string | Date): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - messageDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return `Hier à ${messageDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffDays < 7) {
    return messageDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return messageDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

/**
 * Groupe les messages par date pour l'affichage
 */
export function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const groups = new Map<string, Message[]>();
  
  messages.forEach((message) => {
    const date = new Date(message.created_at).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)?.push(message);
  });
  
  return groups;
}

// ==================== WEB SOCKET (optionnel) ====================

let socket: WebSocket | null = null;
let messageListeners: ((message: Message) => void)[] = [];
let typingListeners: ((indicator: TypingIndicator) => void)[] = [];

/**
 * Se connecte au WebSocket pour les messages en temps réel
 */
export function connectWebSocket(token: string): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
  socket = new WebSocket(`${wsUrl}/chat?token=${token}`);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === "new_message") {
        messageListeners.forEach((listener) => listener(data.message));
      } else if (data.type === "typing") {
        typingListeners.forEach((listener) => listener(data));
      }
    } catch (e) {
      console.error("Erreur WebSocket message:", e);
    }
  };

  socket.onclose = () => {
    socket = null;
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
}

/**
 * Déconnecte le WebSocket
 */
export function disconnectWebSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  }
}

/**
 * Ajoute un listener pour les nouveaux messages
 */
export function addMessageListener(listener: (message: Message) => void): () => void {
  messageListeners.push(listener);
  return () => {
    messageListeners = messageListeners.filter((l) => l !== listener);
  };
}

/**
 * Ajoute un listener pour les indicateurs de frappe
 */
export function addTypingListener(listener: (indicator: TypingIndicator) => void): () => void {
  typingListeners.push(listener);
  return () => {
    typingListeners = typingListeners.filter((l) => l !== listener);
  };
}

/**
 * Envoie un message via WebSocket
 */
export function sendMessageViaWebSocket(message: Partial<Message>): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: "send_message",
      message,
    }));
  } else {
    console.error("WebSocket not connected");
  }
}

// ==================== TYPING INDICATOR ====================

let typingTimeout: NodeJS.Timeout | null = null;

/**
 * Indique que l'utilisateur est en train d'écrire
 */
export function sendTypingIndicator(conversationId: number, isTyping: boolean): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: "typing",
      conversation_id: conversationId,
      is_typing: isTyping,
    }));
  }
}

/**
 * Démarre l'indicateur de frappe (avec délai d'expiration automatique)
 */
export function startTyping(conversationId: number): void {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  sendTypingIndicator(conversationId, true);

  typingTimeout = setTimeout(() => {
    sendTypingIndicator(conversationId, false);
    typingTimeout = null;
  }, 3000);
}

/**
 * Arrête l'indicateur de frappe
 */
export function stopTyping(conversationId: number): void {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  sendTypingIndicator(conversationId, false);
}
