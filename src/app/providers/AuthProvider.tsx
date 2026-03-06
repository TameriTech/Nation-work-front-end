// app/components/auth-provider.tsx
"use client";

import { createContext, useContext, useEffect } from "react";
import { useAuth } from "@/app/hooks/auth/use-auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
