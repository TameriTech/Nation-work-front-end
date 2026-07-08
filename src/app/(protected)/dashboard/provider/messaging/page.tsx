// app/(routes)/messaging/page.tsx
"use client";

import { useState, useEffect } from "react";
import ConversationList from "@/app/components/features/messaging/ConversationList";
import ChatArea from "@/app/components/features/messaging/ChatArea";
import { useChat } from "@/app/hooks/social/use-chat";
import { ChatProvider } from "@/app/contexts/ChatContext";
import { Loader2 } from "lucide-react";

const MessagingPageContent = () => {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  
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
  } = useChat(activeConversationId || undefined);

  // Set first conversation as active when conversations load
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0 && !showChat) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, showChat]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (activeConversationId) {
      markConversationAsRead();
    }
  }, [activeConversationId, markConversationAsRead]);

  const handleSelectConversation = (id: number) => {
    setActiveConversationId(id);
    setShowChat(true);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !activeConversationId) return;
    sendMessage({ content });
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleLoadMore = () => {
    if (hasMoreMessages && !isLoadingMessages) {
      loadMoreMessages();
    }
  };

  if (isLoadingConversations) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 h-[calc(100vh-4rem)] bg-transparent overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          w-full md:w-80 shrink-0
          ${showChat ? "hidden md:block" : "block"}
        `}
      >
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          unreadCounts={{
            total: unreadCount,
            byConversation: {}, // You can pass this if needed
          }}
        />
      </div>

      {/* Chat area */}
      <div
        className={`
          flex-1
          ${!showChat ? "hidden md:flex" : "flex"}
        `}
      >
        {activeConversationId && currentConversation ? (
          <ChatArea
            conversationId={activeConversationId}
            contactName={currentConversation.recipient?.name || "Contact"}
            contactAvatar={currentConversation.recipient?.avatar}
            messages={messages}
            isLoading={isLoadingMessages}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            onBack={handleBack}
            onLoadMore={handleLoadMore}
            hasMore={hasMoreMessages}
            onTyping={handleTyping}
            isTyping={isTyping(currentConversation.provider_id || currentConversation.client_id || 0)}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-white rounded-4xl text-slate-400">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
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
