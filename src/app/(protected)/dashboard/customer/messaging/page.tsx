"use client";
import { useState } from "react";
import ConversationList, {
  Conversation,
} from "@/app/components/features/messaging/ConversationList";
import ChatArea, {
  Message,
} from "@/app/components/features/messaging/ChatArea";

const sampleRecentConversations: Conversation[] = [
  {
    id: "1",
    name: "Nom Prestataire",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "en train d'écrire",
    time: "5min",
    isTyping: true,
    isRead: true,
  },
  {
    id: "2",
    name: "Nom Prestataire",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    lastMessage: "extrait du message",
    time: "1h",
    unreadCount: 2,
  },
  {
    id: "3",
    name: "Nom Prestataire",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
];

const sampleAllConversations: Conversation[] = [
  {
    id: "4",
    name: "Nom Prestataire",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
  {
    id: "5",
    name: "Nom Prestataire",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
  {
    id: "6",
    name: "Nom Prestataire",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
  {
    id: "7",
    name: "Nom Prestataire",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
  {
    id: "8",
    name: "Nom Prestataire",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
  {
    id: "9",
    name: "Nom Prestataire",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
  {
    id: "10",
    name: "Nom Prestataire",
    lastMessage: "extrait du message",
    time: "1h",
    isRead: true,
  },
];

const sampleMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      content: "Bonjour Ludivin 😊",
      time: "10:34",
      isSent: false,
    },
    {
      id: "m2",
      content:
        "Vous pouvez commencer par la Dashboard s'il vous plaît. Il y a plusieurs composants déjà designés, les technologies, sont react, react js. Merci !",
      time: "10:34",
      isSent: false,
    },
    {
      id: "m3",
      content: "",
      time: "10:34",
      isSent: false,
      images: [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop",
      ],
    },
    {
      id: "m4",
      content: "Bien reçu Mr Michael ! 👌",
      time: "10:34",
      isSent: true,
    },
    {
      id: "m5",
      content: "Je m'y met ce soir, le temps d'installer mes dépendances",
      time: "10:34",
      isSent: true,
    },
    {
      id: "m6",
      content:
        "Très bien, merci beaucoup 😊 j'espère que le résultat sera satisfaisant",
      time: "10:34",
      isSent: false,
    },
  ],
};

const MessagingPage = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(
    "1"
  );
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(sampleMessages);

  const allConversations = [
    ...sampleRecentConversations,
    ...sampleAllConversations,
  ];

  const currentConversation = allConversations.find(
    (c) => c.id === activeConversation
  );

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowChat(true); // 👉 mobile: bascule vers le chat
  };

  const handleSendMessage = (content: string) => {
    if (!activeConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      content,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMessage],
    }));
  };

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
            contactName={currentConversation.name}
            contactAvatar={currentConversation.avatar}
            isTyping={currentConversation.isTyping}
            messages={messages[activeConversation!] || []}
            onSendMessage={handleSendMessage}
            onBack={() => setShowChat(false)} // 👈 mobile back
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
