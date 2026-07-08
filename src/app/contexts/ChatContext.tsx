// app/contexts/ChatContext.tsx
"use client";

import { createContext, useContext } from 'react';
import { useAuth } from '@/app/hooks/use-auth';

interface ChatContextType {
  currentUserId: number | null;
}

const ChatContext = createContext<ChatContextType>({ currentUserId: null });

export const useChatContext = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  return (
    <ChatContext.Provider value={{ currentUserId: user?.id || null }}>
      {children}
    </ChatContext.Provider>
  );
}
