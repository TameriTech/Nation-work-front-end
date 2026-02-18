// src/app/services/messages.service.ts

import type { 
  Conversation, 
  Message, 
  ConversationFilters, 
  PaginatedResponse,
  ConversationStats 
} from "@/app/types/admin";

// ==================== CONVERSATIONS ====================

/**
 * Récupère la liste des conversations avec filtres
 */
export async function getConversations(filters?: ConversationFilters): Promise<PaginatedResponse<Conversation>> {
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

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch conversations");
  }

  return res.json();
}

/**
 * Récupère les statistiques des conversations
 */
export async function getConversationStats(): Promise<ConversationStats> {
  const res = await fetch("/api/chat/conversations/stats", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch conversation stats");
  }

  return res.json();
}

/**
 * Récupère une conversation spécifique par son ID
 */
export async function getConversationById(id: number): Promise<Conversation> {
  const res = await fetch(`/api/chat/conversations/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch conversation");
  }

  return res.json();
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
  const res = await fetch("/api/chat/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create conversation");
  }

  return res.json();
}

/**
 * Met à jour une conversation (archivage/désarchivage)
 */
export async function updateConversation(
  id: number, 
  data: Partial<Conversation>
): Promise<Conversation> {
  const res = await fetch(`/api/chat/conversations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update conversation");
  }

  return res.json();
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
  const res = await fetch(`/api/chat/conversations/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete conversation");
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

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch messages");
  }

  return res.json();
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

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to send message");
  }

  return res.json();
}

/**
 * Upload un fichier média pour un message
 */
export async function uploadMessageMedia(
  conversationId: number,
  file: File
): Promise<{ url: string; type: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`/api/chat/conversations/${conversationId}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to upload media");
  }

  return res.json();
}

/**
 * Marque un message comme lu
 */
export async function markMessageAsRead(messageId: number): Promise<Message> {
  const res = await fetch(`/api/chat/messages/${messageId}/read`, {
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to mark message as read");
  }

  return res.json();
}

/**
 * Marque tous les messages d'une conversation comme lus
 */
export async function markConversationAsRead(conversationId: number): Promise<void> {
  const res = await fetch(`/api/chat/conversations/${conversationId}/read`, {
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to mark conversation as read");
  }
}

/**
 * Supprime un message
 */
export async function deleteMessage(messageId: number): Promise<void> {
  const res = await fetch(`/api/chat/messages/${messageId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete message");
  }
}

// ==================== NOTIFICATIONS ====================

/**
 * Récupère le nombre de messages non lus
 */
export async function getUnreadCount(): Promise<{ total: number; by_conversation: Record<number, number> }> {
  const res = await fetch("/api/chat/messages/unread/count", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch unread count");
  }

  return res.json();
}

/**
 * Récupère les conversations avec messages non lus
 */
export async function getUnreadConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/chat/conversations/unread", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch unread conversations");
  }

  return res.json();
}

// ==================== RECHERCHE ====================

/**
 * Recherche dans les messages
 */
export async function searchMessages(query: string, filters?: {
  conversation_id?: number;
  user_id?: number;
  date_from?: string;
  date_to?: string;
}): Promise<Message[]> {
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

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to search messages");
  }

  return res.json();
}

// ==================== UTILS ====================

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

/**
 * Se connecte au WebSocket pour les messages en temps réel
 */
export function connectWebSocket(token: string): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/chat?token=${token}`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "new_message") {
      messageListeners.forEach((listener) => listener(data.message));
    }
  };

  socket.onclose = () => {
    socket = null;
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