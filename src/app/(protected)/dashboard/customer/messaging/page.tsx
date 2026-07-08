// app/dashboard/customer/messaging/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";
import { useTheme } from "next-themes";
import ConversationList from "@/app/components/features/messaging/ConversationList";
import ChatArea from "@/app/components/features/messaging/ChatArea";
import { useChat } from "@/app/hooks/social/use-chat";
import { ChatProvider } from "@/app/contexts/ChatContext";
import { Attachment } from "@/app/types/chat";

const MessagingPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    conversations,
    isLoadingConversations,
    currentConversation,
    messages,
    isLoadingMessages,
    hasMoreMessages,
    loadMoreMessages,
    sendMessage,
    isSending,
    markConversationAsRead,
    isTyping,
    handleTyping,
    unreadCount,
    refreshConversations,
    getOrCreateConversationByServiceCode,
  } = useChat(activeConversationId || undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const username = searchParams.get("username");
  const serviceCode = searchParams.get("service_code");

  // Handle URL parameters on component mount
  useEffect(() => {
    const initializeConversationFromUrl = async () => {
      if (username && serviceCode && !isInitializing && !isLoadingConversations) {
        setIsInitializing(true);
        setError(null);
        
        try {
          let existingConv = conversations?.find(
            conv => conv.service_code === serviceCode && 
                    conv.other_user_name.toLowerCase() === username.toLowerCase()
          );
          
          if (existingConv) {
            setActiveConversationId(existingConv.id);
            setShowChat(true);
            router.replace("/dashboard/customer/messaging", { scroll: true });
          } else {
            const conversation = await getOrCreateConversationByServiceCode(username, serviceCode);
            
            if (conversation && conversation.id) {
              await refreshConversations();
              setActiveConversationId(conversation.id);
              setShowChat(true);
              router.replace("/dashboard/customer/messaging", { scroll: true });
            }
          }
        } catch (err: any) {
          console.error("Error initializing conversation:", err);
          setError(err.message || "Failed to load conversation");
        } finally {
          setIsInitializing(false);
        }
      }
    };
    
    initializeConversationFromUrl();
  }, [username, serviceCode, conversations, isLoadingConversations, getOrCreateConversationByServiceCode, refreshConversations, router]);

  // Set first conversation as active when conversations load (no URL params)
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0 && !showChat && !username && !serviceCode && !isInitializing) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, showChat, username, serviceCode, isInitializing]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (activeConversationId) {
      markConversationAsRead();
    }
  }, [activeConversationId, markConversationAsRead]);

  const handleSelectConversation = useCallback((id: number) => {
    setActiveConversationId(id);
    setShowChat(true);
    if (username || serviceCode) {
      router.replace("/dashboard/customer/messaging", { scroll: true });
    }
  }, [username, serviceCode, router]);

  const handleSendMessage = useCallback((content: string, attachments: Attachment[]) => {
    if ((!content.trim() && attachments.length === 0) || !activeConversationId) return;
    sendMessage(content, attachments);
  }, [activeConversationId, sendMessage]);

  const handleBack = useCallback(() => {
    setShowChat(false);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMoreMessages && !isLoadingMessages) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoadingMessages, loadMoreMessages]);

  const getChatContact = useCallback(() => {
    if (!currentConversation) return null;
    
    return {
      name: currentConversation.conversation.other_user_name || "Contact",
      avatar: currentConversation.conversation.other_user_avatar,
    };
  }, [currentConversation]);

  const chatContact = getChatContact();

  const getOtherUserId = useCallback(() => {
    if (!currentConversation) return 0;
    return currentConversation.conversation.other_user_id ?? 0;
  }, [currentConversation]);

  // Loading state
  if (isLoadingConversations || isInitializing) {
    return (
      <main className="bg-background dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Messagerie
                </h1>
                <p className="text-primary-100">
                  Gérez vos conversations avec les freelances
                </p>
              </div>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  {theme === "dark" ? (
                    <Icon icon="ph:sun" className="w-5 h-5 text-white" />
                  ) : (
                    <Icon icon="ph:moon" className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)]">
          <Icon icon="ph:spinner" className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-text-secondary dark:text-gray-400">
            {isInitializing ? "Chargement de la conversation..." : "Chargement des messages..."}
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="bg-background dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Messagerie
                </h1>
                <p className="text-primary-100">
                  Gérez vos conversations avec les freelances
                </p>
              </div>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  {theme === "dark" ? (
                    <Icon icon="ph:sun" className="w-5 h-5 text-white" />
                  ) : (
                    <Icon icon="ph:moon" className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md text-center">
            <Icon icon="ph:warning-circle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-red-800 dark:text-red-400 font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                router.push("/dashboard/customer/messaging");
              }}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
            >
              Retour à la messagerie
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Messagerie
              </h1>
              <p className="text-primary-100">
                Gérez vos conversations avec les freelances
              </p>
            </div>
            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  {theme === "dark" ? (
                    <Icon icon="ph:sun" className="w-5 h-5 text-white" />
                  ) : (
                    <Icon icon="ph:moon" className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              <div className="relative">
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm">
                  <Icon icon="ph:bell" className="w-5 h-5 text-white" />
                </button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[calc(100vh-18rem)]">
          <div className="flex h-full">
            {/* Sidebar - Liste des conversations */}
            <div
              className={cn(
                "w-full md:w-80 shrink-0 border-r border-gray-100 dark:border-gray-700 bg-surface dark:bg-gray-800",
                showChat ? "hidden md:block" : "block"
              )}
            >
              <ConversationList
                conversations={conversations}
                activeId={activeConversationId}
                onSelect={handleSelectConversation}
                unreadCounts={{
                  total: unreadCount,
                  byConversation: conversations.reduce((acc, conv) => {
                    acc[conv.id] = conv.unreadCount;
                    return acc;
                  }, {} as Record<number, number>),
                }}
              />
            </div>

            {/* Zone de chat */}
            <div
              className={cn(
                "flex-1",
                !showChat ? "hidden md:flex" : "flex"
              )}
            >
              {activeConversationId && currentConversation && chatContact ? (
                <ChatArea
                  conversationId={activeConversationId}
                  contactName={chatContact.name}
                  contactAvatar={chatContact.avatar}
                  messages={messages}
                  isLoading={isLoadingMessages}
                  onSendMessage={handleSendMessage}
                  isSending={isSending}
                  onBack={handleBack}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMoreMessages}
                  onTyping={handleTyping}
                  isTyping={isTyping(getOtherUserId())}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full bg-surface dark:bg-gray-800">
                  <Icon icon="ph:chat" className="w-16 h-16 text-text-secondary dark:text-gray-500 mb-4" />
                  <p className="text-text-secondary dark:text-gray-400">
                    Sélectionnez une conversation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const MessagingPage = () => {
  return (
    <ChatProvider>
      <MessagingPageContent />
    </ChatProvider>
  );
};

export default MessagingPage;