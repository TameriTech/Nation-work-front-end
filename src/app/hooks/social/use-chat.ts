// hooks/chat/useChat.ts

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as messageService from '@/app/services/chat.service';
import type { 
  Conversation, 
  Message, 
  ConversationFilters,
  TypingIndicator 
} from '@/app/types';
import { useEffect, useState, useCallback, useRef } from 'react';

// ==================== CLÉS DE QUERY ====================

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: number) => [...chatKeys.conversations(), id] as const,
  messages: (conversationId: number) => [...chatKeys.all, 'messages', conversationId] as const,
  unread: () => [...chatKeys.all, 'unread'] as const,
  search: (query: string) => [...chatKeys.all, 'search', query] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useChat = (conversationId?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});

  // ==================== QUERIES ====================

  /**
   * Récupère toutes les conversations
   */
  const conversationsQuery = useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => messageService.getConversations(),
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Récupère une conversation spécifique
   */
  const conversationQuery = useQuery({
    queryKey: chatKeys.conversation(conversationId || 0),
    queryFn: () => messageService.getConversationById(conversationId!),
    enabled: !!conversationId,
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Récupère les messages d'une conversation avec pagination
   */
  const messagesQuery = useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId || 0),
    queryFn: ({ pageParam = 1 }) => 
      messageService.getMessages(conversationId!, { page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < 20) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 secondes
  });

  /**
   * Récupère le nombre de messages non lus
   */
  const unreadCountQuery = useQuery({
    queryKey: chatKeys.unread(),
    queryFn: () => messageService.getUnreadCount(),
    staleTime: 30 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Envoie un message
   */
  const sendMessageMutation = useMutation({
    mutationFn: ({ content, media }: { content?: string; media?: File }) =>
      messageService.sendMessage({
        conversation_id: conversationId!,
        content,
        media,
      }),
    onSuccess: (newMessage) => {
      // Invalider les messages
      queryClient.invalidateQueries({ 
        queryKey: chatKeys.messages(conversationId || 0) 
      });
      
      // Mettre à jour la dernière conversation
      queryClient.invalidateQueries({ 
        queryKey: chatKeys.conversations() 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
  });

  /**
   * Upload un média
   */
  const uploadMediaMutation = useMutation({
    mutationFn: (file: File) => messageService.uploadMessageMedia(conversationId!, file),
    onSuccess: (media) => {
      // Envoyer automatiquement le message avec le média
      sendMessageMutation.mutate({ media: media as unknown as File });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'uploader le fichier",
        variant: "destructive",
      });
    },
  });

  /**
   * Marque un message comme lu
   */
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: number) => messageService.markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
    },
  });

  /**
   * Marque toute la conversation comme lue
   */
  const markConversationAsReadMutation = useMutation({
    mutationFn: () => messageService.markConversationAsRead(conversationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });

  /**
   * Archive une conversation
   */
  const archiveConversationMutation = useMutation({
    mutationFn: (archive: boolean) => messageService.archiveConversation(conversationId!, archive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      
      toast({
        title: "Conversation archivée",
        description: "La conversation a été déplacée dans les archives",
      });
    },
  });

  /**
   * Supprime un message
   */
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: number) => messageService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: chatKeys.messages(conversationId || 0) 
      });
    },
  });

  // ==================== WEBSOCKET ====================

  /**
   * Configure le WebSocket pour les messages en temps réel
   */
  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = messageService.connectWebSocket(token);
    
    const handleNewMessage = (message: Message) => {
      if (message.conversation_id === conversationId) {
        // Ajouter le message au cache
        queryClient.setQueryData(
          chatKeys.messages(conversationId),
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: [[message, ...oldData.pages[0]], ...oldData.pages.slice(1)],
            };
          }
        );
        
        // TODO:Marquer comme lu si c'est la conversation active
        //if (message.sender_id !== currentUserId) {
        //  markAsReadMutation.mutate(message.id);
        //}
      }
      
      // Mettre à jour la liste des conversations
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
    };

    const handleTyping = (indicator: TypingIndicator) => {
      if (indicator.conversation_id === conversationId) {
        setTypingUsers(prev => ({
          ...prev,
          [indicator.user_id]: indicator.is_typing,
        }));
      }
    };

    const unsubscribeMessage = messageService.addMessageListener(handleNewMessage);
    const unsubscribeTyping = messageService.addTypingListener(handleTyping);

    setIsConnected(true);

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      messageService.disconnectWebSocket();
      setIsConnected(false);
    };
  }, [conversationId, queryClient]);

  // ==================== TYPING INDICATOR ====================

  const typingTimeoutRef = useRef<NodeJS.Timeout>('' as unknown as NodeJS.Timeout);

  const handleTyping = useCallback(() => {
    if (!conversationId) return;

    messageService.startTyping(conversationId);

    // Nettoyer le timeout précédent
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Arrêter après 3 secondes d'inactivité
    typingTimeoutRef.current = setTimeout(() => {
      messageService.stopTyping(conversationId);
    }, 3000);
  }, [conversationId]);

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Groupe les messages par date
   */
  const getGroupedMessages = () => {
    // Extract the 'data' property from each paginated response
    const messages = messagesQuery.data?.pages.flatMap(page => page.items) || [];
    return messageService.groupMessagesByDate(messages);
  };

  /**
   * Vérifie si un utilisateur est en train d'écrire
   */
  const isTyping = (userId: number) => typingUsers[userId] || false;

  // ==================== RETOUR DU HOOK ====================

  return {
    // Conversations
    conversations: conversationsQuery.data || [],
    isLoadingConversations: conversationsQuery.isLoading,
    
    // Conversation courante
    currentConversation: conversationQuery.data,
    isLoadingConversation: conversationQuery.isLoading,

    // Messages
    messages: messagesQuery.data?.pages.flat() || [],
    isLoadingMessages: messagesQuery.isLoading,
    hasMoreMessages: messagesQuery.hasNextPage,
    loadMoreMessages: messagesQuery.fetchNextPage,
    getGroupedMessages,

    // Non lus
    unreadCount: unreadCountQuery.data?.total || 0,
    unreadByConversation: unreadCountQuery.data?.by_conversation || {},

    // WebSocket
    isConnected,

    // Typing
    isTyping,
    handleTyping,

    // Mutations
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,

    sendMedia: (file: File) => uploadMediaMutation.mutate(file),
    isUploading: uploadMediaMutation.isPending,

    markAsRead: markAsReadMutation.mutate,
    markConversationAsRead: markConversationAsReadMutation.mutate,
    archiveConversation: (archive: boolean) => archiveConversationMutation.mutate(archive),
    deleteMessage: deleteMessageMutation.mutate,

    // Rafraîchissement
    refetchConversations: () => queryClient.invalidateQueries({ 
      queryKey: chatKeys.conversations() 
    }),
    refetchMessages: () => queryClient.invalidateQueries({ 
      queryKey: chatKeys.messages(conversationId || 0) 
    }),
  };
};
