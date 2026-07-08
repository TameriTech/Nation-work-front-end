"use client";
import { useState } from "react";
import ConversationList from "@/app/components/features/messaging/ConversationList";
import ChatArea from "@/app/components/features/messaging/ChatArea";
import { Conversation, CreateMessagePayload, Message } from "@/app/types/chat";
import {
  sampleRecentConversations,
  sampleAllConversations,
  sampleMessages,
} from "@/data/mock";

const MessagingPage = () => {
  const [activeConversation, setActiveConversation] = useState<number>(1);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(sampleMessages);

  const allConversations = [
    ...sampleRecentConversations,
    ...sampleAllConversations,
  ];
  const currentConversation = allConversations.find(
    (c: Conversation) => c.id === activeConversation,
  );

  const handleSendMessage = (content: string) => {
    if (!activeConversation) return;

    const newMessage: CreateMessagePayload = {
      conversation_id: currentConversation!.id,
      content,
      media_url: [],
      media_type: "text",
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMessage],
    }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-transparent overflow-hidden gap-2.5">
      <div className="w-80 shrink-0">
        <ConversationList
          recentConversations={sampleRecentConversations}
          allConversations={sampleAllConversations}
          activeId={activeConversation}
          onSelect={setActiveConversation}
        />
      </div>

      <div className="flex-1">
        {currentConversation ? (
          <ChatArea
            contactName={currentConversation.recipient.name}
            contactAvatar={currentConversation.recipient.avatar}
            isTyping={currentConversation.is_typing || false}
            messages={messages[activeConversation] || []}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
