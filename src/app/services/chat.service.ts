// src/app/services/messages.service.ts

import type {
  ConversationListResponse,
  ConversationDetail,
  Message, 
  ConversationFilters, 
  PaginatedResponse,
  ConversationStats,
  ChatStats,
  TypingIndicator,
  MessageReactionResponse,
  MessageSearchResponse,
  UnreadCountResponse,
  MessageCreateSimple,
  MessageFilters,
  MessageListResponse,
  FileUploadResponse,
  ConversationDetailResponse,
  AdminConversationDetailResponse
} from "@/app/types";
import { 
  ConversationCreateFormData,
  ConversationFiltersFormData,
  MessageCreateSimpleFormData,
  MessageFiltersFormData,
  MessageReactionFormData,
  MessageSearchFormData,
  TypingIndicatorFormData,
  ConversationCreateSchema,
  ConversationFiltersSchema,
  MessageCreateSimpleSchema,
  MessageFiltersSchema,
  MessageReactionSchema,
  MessageSearchSchema,
  TypingIndicatorSchema
} from "@/app/lib/validators/chat.validator";
import { handleResponse } from "@/app/lib/error-handler";


/**
 * Récupère toutes les conversations pour l'admin (avec pagination)
 */
export async function getAdminConversations(
  filters?: ConversationFilters
): Promise<PaginatedResponse<ConversationListResponse>> {
  try {
    const validatedFilters = filters ? filters : { page: 1, limit: 20 };
    const params = new URLSearchParams();
    
    // Paramètres de pagination
    if (validatedFilters.page) {
      params.append('page', String(validatedFilters.page));
    }
    if (validatedFilters.limit) {
      params.append('limit', String(validatedFilters.limit));
    }
    
    // Paramètres de recherche et filtres
    if (validatedFilters.search) {
      params.append('search', validatedFilters.search);
    }
    if (validatedFilters.is_active !== undefined) {
      params.append('is_active', String(validatedFilters.is_active));
    }
    if (validatedFilters.participant_type) {
      params.append('participant_type', validatedFilters.participant_type);
    }
    if (validatedFilters.date_from) {
      params.append('date_from', validatedFilters.date_from);
    }
    if (validatedFilters.date_to) {
      params.append('date_to', validatedFilters.date_to);
    }
    if (validatedFilters.sort_by) {
      params.append('sort_by', validatedFilters.sort_by);
    }
    if (validatedFilters.sort_order) {
      params.append('sort_order', validatedFilters.sort_order);
    }

    const response = await fetch(`/api/admin/chat/conversations?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<PaginatedResponse<ConversationListResponse>>(response);
  } catch (error) {
    console.error('Erreur getAdminConversations:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques admin du chat
 */
export async function getAdminChatStats(): Promise<{
  total_conversations: number;
  active_conversations: number;
  total_messages: number;
  unread_count: number;
  engagement_rate: number;
  participants: number;
  archived_conversations: number;
}> {
  try {
    const response = await fetch('/api/admin/chat/stats', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await handleResponse<{
      total_conversations: number;
      active_conversations: number;
      total_messages: number;
      unread_messages: number;
      engagement_rate: number;
      participants: number;
      archived_conversations: number;
    }>(response);
    
    return {
      total_conversations: data.total_conversations || 0,
      active_conversations: data.active_conversations || 0,
      total_messages: data.total_messages || 0,
      unread_count: data.unread_messages || 0,
      engagement_rate: data.engagement_rate || 0,
      participants: data.participants || 0,
      archived_conversations: data.archived_conversations || 0,
    };
  } catch (error) {
    console.error('Erreur getAdminChatStats:', error);
    throw error;
  }
}

/**
 * Récupère une conversation spécifique par ID
 */
export async function adminGetConversationById(
  conversationId: number
): Promise<AdminConversationDetailResponse> {
  try {
    const response = await fetch(`/api/admin/chat/conversations/${conversationId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<AdminConversationDetailResponse>(response);
  } catch (error) {
    console.error('Erreur getConversationById:', error);
    throw error;
  }
}

export async function getConversationById(
  conversationId: number
): Promise<AdminConversationDetailResponse> {
  try {
    const response = await fetch(`/api/chat/conversations/${conversationId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<AdminConversationDetailResponse>(response);
  } catch (error) {
    console.error('Erreur getConversationById:', error);
    throw error;
  }
}

/**
 * Récupère les messages d'une conversation (avec pagination)
 */
export async function getConversationMessages(
  conversationId: number,
  filters?: { limit?: number; before_id?: number; after_id?: number }
): Promise<MessageListResponse[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.limit) {
      params.append('limit', String(filters.limit));
    }
    if (filters?.before_id) {
      params.append('before_id', String(filters.before_id));
    }
    if (filters?.after_id) {
      params.append('after_id', String(filters.after_id));
    }

    const response = await fetch(`/api/chat/conversations/${conversationId}/messages?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<MessageListResponse[]>(response);
  } catch (error) {
    console.error('Erreur getConversationMessages:', error);
    throw error;
  }
}



/**
 * Archive une conversation
 */
export async function archiveConversation(
  conversationId: number,
  archive: boolean
): Promise<void> {
  try {
    if (archive) {
      const response = await fetch(`/api/admin/chat/conversations/${conversationId}/archive`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      await handleResponse(response);
    } else {
      const response = await fetch(`/api/admin/chat/conversations/${conversationId}/restore`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      await handleResponse(response);
    }
  } catch (error) {
    console.error('Erreur archiveConversation:', error);
    throw error;
  }
}

/**
 * Supprime définitivement une conversation (admin)
 */
export async function deleteConversation(conversationId: number): Promise<void> {
  try {
    const response = await fetch(`/api/admin/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    await handleResponse(response);
  } catch (error) {
    console.error('Erreur deleteConversation:', error);
    throw error;
  }
}

/**
 * Marque une conversation comme lue
 */
export async function markConversationAsRead(conversationId: number): Promise<{ success: boolean; count: number }> {
  try {
    const response = await fetch(`/api/chat/conversations/${conversationId}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ success: boolean; count: number }>(response);
  } catch (error) {
    console.error('Erreur markConversationAsRead:', error);
    throw error;
  }
}

/**
 * Marque un message comme lu
 */
export async function markMessageAsRead(messageId: number): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/chat/messages/${messageId}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ success: boolean }>(response);
  } catch (error) {
    console.error('Erreur markMessageAsRead:', error);
    throw error;
  }
}

/**
 * Ajoute une réaction à un message
 */
export async function addReaction(
  messageId: number,
  reaction: string
): Promise<{ message_id: number; reactions: Record<string, number[]>; user_reaction: string }> {
  try {
    const response = await fetch(`/api/chat/messages/${messageId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Erreur addReaction:', error);
    throw error;
  }
}

/**
 * Supprime une réaction d'un message
 */
export async function removeReaction(
  messageId: number,
  reaction: string
): Promise<{ message_id: number; reactions: Record<string, number[]>; user_reaction: string | null }> {
  try {
    const response = await fetch(`/api/chat/messages/${messageId}/reactions`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Erreur removeReaction:', error);
    throw error;
  }
}

/**
 * Supprime un message
 */
export async function deleteMessage(
  messageId: number,
  hardDelete: boolean = false
): Promise<{ success: boolean }> {
  try {
    const params = new URLSearchParams();
    params.append('hard_delete', String(hardDelete));
    
    const response = await fetch(`/api/chat/messages/${messageId}?${params.toString()}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ success: boolean }>(response);
  } catch (error) {
    console.error('Erreur deleteMessage:', error);
    throw error;
  }
}

/**
 * Récupère ou crée une conversation par code de service
 */
export async function getOrCreateConversationByServiceCode(
  username: string,
  serviceCode: string
): Promise<ConversationDetailResponse> {
  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('service_code', serviceCode);
    
    const response = await fetch(`/api/chat/conversations/by-service?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<ConversationDetailResponse>(response);
  } catch (error) {
    console.error('Erreur getOrCreateConversationByServiceCode:', error);
    throw error;
  }
}



/**
 * Récupère les statistiques des conversations
 * GET /api/chat/stats
 */
export async function getChatStats(): Promise<ChatStats> {
  try {
    const res = await fetch("/api/chat/stats", {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    });

    return await handleResponse<ChatStats>(res);
  } catch (error) {
    console.error("Erreur getChatStats:", error);
    throw error;
  }
}


export async function getConversationByServiceCode(username: string, serviceCode: string): Promise<ConversationDetail> {
  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('service_code', serviceCode);

    // This will call the Next.js API route we just created
    const res = await fetch(`/api/chat/conversations/by-service?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to get conversation');
    }

    return await res.json();
  } catch (error) {
    console.error(`Erreur getConversationByServiceCode ${username}/${serviceCode}:`, error);
    throw error;
  }
}

/**
 * Crée une nouvelle conversation
 * POST /api/chat/conversations
 */
export async function createConversation(data: ConversationCreateFormData): Promise<ConversationDetailResponse> {
  try {
    const validatedData = ConversationCreateSchema.parse(data);
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    return await handleResponse<ConversationDetailResponse>(res);
  } catch (error) {
    console.error("Erreur createConversation:", error);
    throw error;
  }
}


// ==================== MESSAGES ====================

/**
 * Récupère les messages d'une conversation
 * GET /api/chat/conversations/{conversationId}/messages
 */
export async function getMessages(
  conversationId: number,
  filters?: MessageFiltersFormData
): Promise<MessageListResponse[]> {
  try {
    const validatedFilters = filters ? MessageFiltersSchema.parse(filters) : { 
      limit: 50, 
      include_system: true 
    };
    
    const params = new URLSearchParams();
    
    if (validatedFilters.limit) params.append('limit', String(validatedFilters.limit));
    if (validatedFilters.before_id) params.append('before_id', String(validatedFilters.before_id));
    if (validatedFilters.after_id) params.append('after_id', String(validatedFilters.after_id));
    if (validatedFilters.message_type) params.append('message_type', validatedFilters.message_type);
    if (validatedFilters.include_system !== undefined) params.append('include_system', String(validatedFilters.include_system));

    const res = await fetch(`/api/chat/conversations/${conversationId}/messages?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    });

    return await handleResponse<MessageListResponse[]>(res);
  } catch (error) {
    console.error(`Erreur getMessages ${conversationId}:`, error);
    throw error;
  }
}

/**
 * Envoie un nouveau message
 * POST /api/chat/conversations/{conversationId}/messages
 */
export async function sendMessage(
  conversationId: number,
  data: MessageCreateSimpleFormData
): Promise<MessageListResponse> {
  try {
    const validatedData = MessageCreateSimpleSchema.parse(data);
    
    // Ne pas envoyer images, seulement attachments
    const payload = {
      content: validatedData.content,
      attachments: validatedData.attachments,
      message_type: validatedData.message_type,
      reply_to: validatedData.reply_to
    };
    
    const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse<MessageListResponse>(res);
  } catch (error) {
    console.error("Erreur sendMessage:", error);
    throw error;
  }
}

/**
 * Upload un fichier média pour un message
 * POST /api/chat/conversations/{conversationId}/upload
 */
export async function uploadMessageMedia(
  conversationId: number,
  file: File
): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/chat/conversations/${conversationId}/upload`, {
      method: "POST",
      body: formData,
    });

    return await handleResponse<FileUploadResponse>(res);
  } catch (error) {
    console.error(`Erreur uploadMessageMedia ${conversationId}:`, error);
    throw error;
  }
}

/**
 * Marque plusieurs messages comme lus
 * PUT /api/chat/messages/read
 */
export async function markMultipleMessagesAsRead(messageIds: number[]): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const res = await fetch(`/api/chat/messages/read`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageIds),
    });

    return await handleResponse<{ success: boolean; count: number; message: string }>(res);
  } catch (error) {
    console.error("Erreur markMultipleMessagesAsRead:", error);
    throw error;
  }
}


// ==================== STATISTIQUES ====================

/**
 * Récupère les statistiques d'une conversation spécifique
 * GET /api/chat/conversations/{conversationId}/stats
 */
export async function getConversationStats(conversationId: number): Promise<ConversationStats> {
  try {
    const res = await fetch(`/api/chat/conversations/${conversationId}/stats`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    });

    return await handleResponse<ConversationStats>(res);
  } catch (error) {
    console.error(`Erreur getConversationStats ${conversationId}:`, error);
    throw error;
  }
}

// ==================== RECHERCHE ====================

/**
 * Recherche dans les messages
 * GET /api/chat/search/messages
 */
export async function searchMessages(
  query: string, 
  filters?: {
    conversation_id?: number;
    user_id?: number;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }
): Promise<MessageSearchResponse> {
  try {
    const validatedData = MessageSearchSchema.parse({ q: query, ...filters });
    
    const params = new URLSearchParams();
    params.append('q', validatedData.q);
    if (validatedData.limit) params.append('limit', String(validatedData.limit));
    if (validatedData.conversation_id) params.append('conversation_id', String(validatedData.conversation_id));
    if (validatedData.user_id) params.append('user_id', String(validatedData.user_id));
    if (validatedData.date_from) params.append('from_date', validatedData.date_from);
    if (validatedData.date_to) params.append('to_date', validatedData.date_to);

    const res = await fetch(`/api/chat/search/messages?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    });

    return await handleResponse<MessageSearchResponse>(res);
  } catch (error) {
    console.error("Erreur searchMessages:", error);
    throw error;
  }
}

// ==================== NOTIFICATIONS ====================

/**
 * Récupère le nombre de messages non lus
 * GET /api/chat/unread/count - Note: Cet endpoint n'existe pas dans les routes, nous devons le calculer
 */
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  try {
    // Récupérer toutes les conversations pour calculer les non lus
    const conversations = await getConversations({ limit: 100, include_inactive: false });
    
    const by_conversation: Record<number, number> = {};
    let total = 0;
    
    conversations.forEach(conv => {
      if (conv.unreadCount > 0) {
        by_conversation[conv.id] = conv.unreadCount;
        total += conv.unreadCount;
      }
    });
    
    return { total, by_conversation };
  } catch (error) {
    console.error("Erreur getUnreadCount:", error);
    throw error;
  }
}

/**
 * Récupère les conversations avec messages non lus
 */
// src/app/services/messages.service.ts - Version modifiée de getConversations

/**
 * Récupère la liste des conversations avec filtres
 * GET /api/chat/conversations
 */
export async function getConversations(
  filters?: {
    search?: string;
    unread_only?: boolean;
    limit?: number;
    skip?: number;
    include_inactive?: boolean;
    sort_by?: 'last_message_at' | 'created_at' | 'message_count';
    sort_order?: 'asc' | 'desc';
  }
): Promise<ConversationListResponse[]> {
  try {
    // Valeurs par défaut
    const params = new URLSearchParams();
    
    params.append('limit', filters?.limit?.toString() || '50');
    params.append('skip', filters?.skip?.toString() || '0');
    params.append('include_inactive', filters?.include_inactive?.toString() || 'false');
    params.append('sort_by', filters?.sort_by || 'last_message_at');
    params.append('sort_order', filters?.sort_order || 'desc');
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.unread_only) params.append('unread_only', String(filters.unread_only));

    const res = await fetch(`/api/chat/conversations?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    });

    return await handleResponse<ConversationListResponse[]>(res);
  } catch (error) {
    console.error("Erreur getConversations:", error);
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
export function groupMessagesByDate(messages: MessageListResponse[]): Map<string, MessageListResponse[]> {
  const groups = new Map<string, MessageListResponse[]>();
  
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

// ==================== WEB SOCKET ====================

let socket: WebSocket | null = null;
let messageListeners: ((message: MessageListResponse) => void)[] = [];
let typingListeners: ((indicator: TypingIndicator) => void)[] = [];
let reactionListeners: ((data: any) => void)[] = [];
let readListeners: ((data: any) => void)[] = [];

/**
 * Se connecte au WebSocket pour les messages en temps réel
 */
export function connectWebSocket(token: string, conversationId?: number): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
  const url = conversationId 
    ? `${wsUrl}/chat/ws/${conversationId}?token=${token}`
    : `${wsUrl}/chat?token=${token}`;
  
  socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "new_message":
          messageListeners.forEach((listener) => listener(data.message));
          break;
        case "typing":
          typingListeners.forEach((listener) => listener(data));
          break;
        case "reaction_added":
        case "reaction_removed":
        case "reaction_updated":
          reactionListeners.forEach((listener) => listener(data));
          break;
        case "message_read":
        case "messages_read":
        case "conversation_read":
          readListeners.forEach((listener) => listener(data));
          break;
        case "connection_established":
          console.log("WebSocket connected:", data);
          break;
        case "unread_count":
          // Gérer la mise à jour du compteur
          break;
        default:
          console.log("WebSocket message:", data);
      }
    } catch (e) {
      console.error("Erreur WebSocket message:", e);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
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
  
  // Vider les listeners
  messageListeners = [];
  typingListeners = [];
  reactionListeners = [];
  readListeners = [];
}

/**
 * Ajoute un listener pour les nouveaux messages
 */
export function addMessageListener(listener: (message: MessageListResponse) => void): () => void {
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
 * Ajoute un listener pour les réactions
 */
export function addReactionListener(listener: (data: any) => void): () => void {
  reactionListeners.push(listener);
  return () => {
    reactionListeners = reactionListeners.filter((l) => l !== listener);
  };
}

/**
 * Ajoute un listener pour les accusés de lecture
 */
export function addReadListener(listener: (data: any) => void): () => void {
  readListeners.push(listener);
  return () => {
    readListeners = readListeners.filter((l) => l !== listener);
  };
}

/**
 * Envoie un message via WebSocket
 */
export function sendMessageViaWebSocket(message: {
  content?: string;
  images?: string[];
  reply_to?: number;
}): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: "message",
      ...message
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

// ==================== ADMIN ROUTES ====================

/**
 * Récupère toutes les conversations d'un utilisateur spécifique (admin)
 * GET /api/chat/admin/users/{userId}/conversations
 */
export const getUserConversationsAdmin = async (
  userId: number, 
  filters?: ConversationFilters
): Promise<{
  items: ConversationListResponse[];
  pagination: { total: number; page: number; limit: number };
}> => {
  const params: Record<string, any> = {
    skip: ((filters?.page || 1) - 1) * (filters?.limit || 20),
    limit: filters?.limit || 20,
  };
  
  if (filters?.search) params.search = filters.search;
  if (filters?.is_active !== undefined) params.is_active = filters.is_active;
  try {
    const response = await fetch(`/chat/admin/users/${userId}/conversations/${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      
    });
    return await handleResponse<{
      items: ConversationListResponse[];
      pagination: { total: number; page: number; limit: number };
    }>(response);
  } catch (error) {
    console.error("Erreur getUserConversationsAdmin:", error);
    throw error;
  }
};
