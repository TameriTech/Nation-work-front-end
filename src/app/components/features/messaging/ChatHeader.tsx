// app/components/features/messaging/ChatHeader.tsx
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useChat } from "@/app/hooks/social/use-chat";
import { cn } from "@/app/lib/utils";

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  isTyping?: boolean;
  onBack?: () => void;
  conversationId?: number;
}

const ChatHeader = ({
  name,
  avatar,
  isTyping = false,
  onBack,
  conversationId,
}: ChatHeaderProps) => {
  const { archiveConversation } = useChat(conversationId);

  const handleArchive = () => {
    if (conversationId) {
      archiveConversation(true);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-surface dark:bg-gray-800 rounded-t-2xl border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon icon="ph:arrow-left" className="h-6 w-6" />
          </button>
        )}
        
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-offset-1 ring-gray-200 dark:ring-gray-700">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isTyping && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          )}
        </div>
        
        <div>
          <p className="font-semibold text-text-primary dark:text-gray-100">{name}</p>
          {isTyping ? (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium animate-pulse">
              En train d'écrire...
            </p>
          ) : (
            <p className="text-xs text-text-secondary dark:text-gray-400">En ligne</p>
          )}
        </div>
      </div>

      {conversationId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Icon icon="ph:dots-three-vertical" className="h-5 w-5 text-text-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-surface dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem onClick={handleArchive} className="cursor-pointer">
              <Icon icon="ph:archive" className="mr-2 h-4 w-4" />
              Archiver
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              <Icon icon="ph:prohibit" className="mr-2 h-4 w-4" />
              Bloquer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ChatHeader;
