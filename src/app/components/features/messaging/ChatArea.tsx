// app/components/features/messaging/ChatArea.tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Attachment, MessageListResponse } from "@/app/types/chat";
import { useChatContext } from "@/app/contexts/ChatContext";
import { Loader2 } from "lucide-react";
import { groupMessagesByDate } from "@/app/services/chat.service";
import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";

interface ChatAreaProps {
  conversationId: number;
  contactName: string;
  contactAvatar?: string;
  messages: MessageListResponse[];
  isLoading?: boolean;
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  isSending?: boolean;
  onBack?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onTyping?: () => void;
  isTyping?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType?: string, fileType?: string) => {
  if (mimeType?.startsWith("image/") || fileType === "image") return "ph:image";
  if (mimeType === "application/pdf") return "ph:file-pdf";
  if (mimeType?.includes("word")) return "ph:file-doc";
  if (mimeType?.includes("excel")) return "ph:file-xls";
  if (mimeType?.startsWith("video/") || fileType === "video") return "ph:video";
  if (mimeType?.startsWith("audio/") || fileType === "audio") return "ph:music-note";
  if (mimeType?.includes("zip")) return "ph:archive";
  if (fileType === "document") return "ph:file-text";
  if (fileType === "code") return "ph:code";
  return "ph:file";
};

const AttachmentList = ({ attachments }: { attachments: Attachment[] }) => {
  if (!attachments || attachments.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {attachments.map((att, idx) => (
        <div key={idx} className="relative">
          {att.type === "image" ? (
            <img 
              src={att.url} 
              alt={att.name}
              className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(att.url, '_blank')}
            />
          ) : (
            <a 
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Icon icon={getFileIcon(att.mime_type, att.type)} className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium truncate max-w-[200px] text-text-primary dark:text-gray-100">{att.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{formatFileSize(att.size)}</p>
              </div>
              <Icon icon="ph:arrow-square-out" className="h-4 w-4 text-gray-400" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const ChatArea = ({
  conversationId,
  contactName,
  contactAvatar,
  messages,
  isLoading = false,
  onSendMessage,
  isSending = false,
  onBack,
  onLoadMore,
  hasMore = false,
  onTyping,
  isTyping = false,
}: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { currentUserId } = useChatContext();

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore?.();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full w-full bg-surface dark:bg-gray-800 rounded-2xl">
      <ChatHeader
        name={contactName}
        avatar={contactAvatar}
        isTyping={isTyping}
        onBack={onBack}
        conversationId={conversationId}
      />

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-2">
            {isLoading && (
              <Icon icon="ph:spinner" className="h-5 w-5 animate-spin text-primary" />
            )}
          </div>
        )}

        <div className="space-y-6">
          {Array.from(groupedMessages.entries()).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="text-center">
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              {dateMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_delivered ? "justify-end" : "justify-start"}`}
                >
                  <MessageBubble message={msg} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      <MessageInput
        onSend={onSendMessage}
        onTyping={onTyping}
        disabled={isSending}
        conversationId={conversationId}
      />
    </div>
  );
};

export default ChatArea;
