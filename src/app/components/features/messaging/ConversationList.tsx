// app/components/features/messaging/ConversationList.tsx
"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import ConversationItem from "./ConversationItem";
import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";
import { ConversationListResponse } from "@/app/types/chat";

interface ConversationListProps {
  conversations: ConversationListResponse[];
  activeId: number | null;
  onSelect: (id: number) => void;
  unreadCounts: {
    total: number;
    byConversation: Record<number, number>;
  };
}

const ConversationList = ({
  conversations,
  activeId,
  onSelect,
  unreadCounts,
}: ConversationListProps) => {
  const [search, setSearch] = useState("");

  const filterConversations = (conversations: ConversationListResponse[]) => {
    if (!search) return conversations;
    return conversations.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.service_title?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const recentConversations = filterConversations(
    conversations.filter(c => {
      const lastMessageDate = c.lastMessageTime ? new Date(c.lastMessageTime) : null;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastMessageDate && lastMessageDate > weekAgo;
    })
  );

  const olderConversations = filterConversations(
    conversations.filter(c => {
      const lastMessageDate = c.lastMessageTime ? new Date(c.lastMessageTime) : null;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return !lastMessageDate || lastMessageDate <= weekAgo;
    })
  );

  return (
    <div className="flex flex-col bg-surface dark:bg-gray-800 rounded-2xl h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
            Discussions
          </h2>
          {unreadCounts.total > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {unreadCounts.total} non lu{unreadCounts.total > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="relative">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary dark:text-gray-400"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une discussion..."
            className="pl-10 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-text-primary dark:text-gray-100"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Icon icon="ph:x" className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {recentConversations.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-text-secondary dark:text-gray-400 mb-2">
              Récentes
            </h3>
            <div className="space-y-1">
              {recentConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeId === conv.id}
                  onClick={() => onSelect(conv.id)}
                  unreadCount={unreadCounts.byConversation[conv.id] || 0}
                />
              ))}
            </div>
          </div>
        )}

        {olderConversations.length > 0 && (
          <div className="p-4 pt-0">
            <h3 className="text-sm font-semibold text-text-secondary dark:text-gray-400 mb-2">
              Plus anciennes
            </h3>
            <div className="space-y-1">
              {olderConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeId === conv.id}
                  onClick={() => onSelect(conv.id)}
                  unreadCount={unreadCounts.byConversation[conv.id] || 0}
                />
              ))}
            </div>
          </div>
        )}

        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Icon icon="ph:chat" className="h-12 w-12 text-text-secondary dark:text-gray-500 mb-3" />
            <p className="text-text-secondary dark:text-gray-400">Aucune conversation pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
