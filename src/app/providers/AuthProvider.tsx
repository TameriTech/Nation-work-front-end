// contexts/AuthContext.tsx
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";
import * as userService from "@/app/services/auth.service";

// ==================== CLÉS DE QUERY ====================
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// ==================== TYPES ====================
interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// ==================== CONTEXT ====================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Single source of truth - let the backend decide authentication
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        // Backend validates the HttpOnly cookie automatically
        // Returns 401 if not authenticated
        return await userService.getCurrentUser();
      } catch (error: any) {
        // 401 means not authenticated - return null, don't throw
        if (error?.response?.status === 401) {
          return null;
        }
        // Other errors (network, 500) should be handled
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const value = {
    user: user ?? null,
    isLoading,
    isError,
    error: error as Error | null,
    refetch: () => queryClient.invalidateQueries({ queryKey: authKeys.user() }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== HOOK ====================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
