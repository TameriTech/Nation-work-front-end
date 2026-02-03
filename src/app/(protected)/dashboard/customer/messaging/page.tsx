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
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(sampleMessages);

  const allConversations = [
    ...sampleRecentConversations,
    ...sampleAllConversations,
  ];

  const currentConversation = allConversations.find(
    (c: Conversation) => c.id === activeConversation,
  );

  const handleSelectConversation = (id: number) => {
    setActiveConversation(id);
    setShowChat(true); // 👉 mobile: bascule vers le chat
  };

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

  // TODO fetch data from API and replace the hardcoded values
  return (
    <div className="flex gap-2 h-[calc(100vh-4rem)] bg-transparent overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          w-full md:w-80 shrink-0
          ${showChat ? "hidden md:block" : "block"}
        `}
      >
        <div
          className={`
    w-full md:w-80 shrink-0
    ${showChat ? "hidden md:block" : "block"}
  `}
        >
          <ConversationList
            recentConversations={sampleRecentConversations}
            allConversations={sampleAllConversations}
            activeId={activeConversation}
            onSelect={(id) => {
              setActiveConversation(id);
              setShowChat(true); // 👈 mobile
            }}
          />
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`
          flex-1
          ${!showChat ? "hidden md:flex" : "flex"}
        `}
      >
        {currentConversation ? (
          <ChatArea
            contactName={currentConversation.recipient.name}
            contactAvatar={currentConversation.recipient.avatar}
            isTyping={currentConversation.is_typing}
            messages={messages[activeConversation!] || []}
            onSendMessage={handleSendMessage}
            onBack={() => setShowChat(false)} // 👈 mobile back
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
