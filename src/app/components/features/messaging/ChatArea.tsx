"use client";
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export interface Message {
  id: string;
  content: string;
  time: string;
  isSent: boolean;
  images?: string[];
}

interface ChatAreaProps {
  contactName: string;
  contactAvatar?: string;
  isTyping?: boolean;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBack?: () => void;
}

const ChatArea = ({
  contactName,
  contactAvatar,
  isTyping = false,
  messages,
  onSendMessage,
  onBack,
}: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-4xl">
      <ChatHeader
        name={contactName}
        avatar={contactAvatar}
        isTyping={isTyping}
        onBack={onBack}
      />

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSent ? "justify-start" : "justify-end"}`}
            >
              <MessageBubble {...msg} />
            </div>
          ))}
        </div>
      </ScrollArea>

      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default ChatArea;
