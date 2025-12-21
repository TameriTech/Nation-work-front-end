"use client";
import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import ConversationItem from "./ConversationItem";
import { Icon } from "@iconify/react";

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  isTyping?: boolean;
  isRead?: boolean;
  unreadCount?: number;
}

interface ConversationListProps {
  recentConversations: Conversation[];
  allConversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const ConversationList = ({
  recentConversations,
  allConversations,
  activeId,
  onSelect,
}: ConversationListProps) => {
  const [search, setSearch] = useState("");

  const filterConversations = (conversations: Conversation[]) => {
    if (!search) return conversations;
    return conversations.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col bg-white rounded-[30px] h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Discussion avec les prestataires
        </h2>

        <div className="relative">
          <Icon
            icon={"mdi:search"}
            className="absolute right-3 text-blue-900 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="rechercher"
            className="py-2.5 pl-3.5 pr-9 rounded-full bg-white border-border placeholder:text-gray-600"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon icon={"mdi:close"} className="h-6 w-6 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filterConversations(recentConversations).length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Discussions récentes
            </h3>
            <div className="space-y-1">
              {filterConversations(recentConversations).map((conv) => (
                <ConversationItem
                  key={conv.id}
                  {...conv}
                  isActive={activeId === conv.id}
                  onClick={() => onSelect(conv.id)}
                />
              ))}
            </div>
          </div>
        )}

        {filterConversations(allConversations).length > 0 && (
          <div className="p-4 pt-0">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Toutes les discussions
            </h3>
            <div className="space-y-1">
              {filterConversations(allConversations).map((conv) => (
                <ConversationItem
                  key={conv.id}
                  {...conv}
                  isActive={activeId === conv.id}
                  onClick={() => onSelect(conv.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
