// app/components/features/messaging/ConversationItem.tsx
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { cn } from "@/app/lib/utils";
import { Icon } from "@iconify/react";
import { ConversationListResponse } from "@/app/types/chat";
import { formatMessageDate } from "@/app/services/chat.service";

interface ConversationItemProps {
  conversation: ConversationListResponse;
  isActive?: boolean;
  onClick?: () => void;
  unreadCount?: number;
}

const ConversationItem = ({
  conversation,
  isActive,
  onClick,
  unreadCount = 0,
}: ConversationItemProps) => {
  const recipient = { name: conversation.name, avatar: conversation.avatar }
  const lastMessage = conversation.lastMessage ? {
        content: conversation.lastMessage,
        created_at: conversation.lastMessageTime,
      }
    : null;
  const hasUnread = unreadCount > 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
        isActive ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary" : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
        hasUnread && !isActive && "bg-blue-50/50 dark:bg-blue-900/20",
      )}
    >
      <Avatar className="h-12 w-12 shrink-0 ring-2 ring-offset-1 ring-gray-200 dark:ring-gray-700">
        <AvatarImage
          src={recipient?.avatar || undefined}
          alt={recipient?.name || "Contact"}
        />
        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
          {recipient?.name?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-text-primary dark:text-gray-100 truncate">
            {recipient?.name || "Contact"}
          </p>
          {lastMessage?.created_at && (
            <span className="text-xs text-text-secondary dark:text-gray-400 whitespace-nowrap ml-2">
              {formatMessageDate(lastMessage.created_at)}
            </span>
          )}
        </div>

        {conversation.is_active ? (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">
            En train d'écrire...
          </p>
        ) : (
          <p
            className={cn(
              "text-sm truncate",
              hasUnread ? "text-text-primary dark:text-gray-100 font-medium" : "text-text-secondary dark:text-gray-400",
            )}
          >
            {lastMessage?.content || "Nouvelle conversation"}
          </p>
        )}

        {conversation.service_title && (
          <p className="text-xs text-text-secondary dark:text-gray-500 truncate mt-1">
            Service: {conversation.service_title}
            {conversation.service_code && (
              <span className="ml-2 text-xs text-text-secondary dark:text-gray-500">
                (#{conversation.service_code})
              </span>
            )}
          </p>
        )}
      </div>

      {hasUnread && (
        <div className="shrink-0">
          <span className="flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-primary text-white text-xs font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
