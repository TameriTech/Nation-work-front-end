// contexts/AuthContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

interface AuthState {
  token: string | null;
  role: string | null;
  userId: number | null;
}

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window === "undefined")
      return { token: null, role: null, userId: null };

    return {
      token: localStorage.getItem("access_token"),
      role: localStorage.getItem("role"),
      userId: localStorage.getItem("userId")
        ? Number(localStorage.getItem("userId"))
        : null,
    };
  });

  const loginUser = (data: {
    access_token: string;
    user_role: string;
    user_id: number;
  }) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("role", data.user_role);
    localStorage.setItem("userId", String(data.user_id));

    // save token in cookie
    document.cookie = `access_token=${data.access_token}; path=/;`;

    setAuth({
      token: data.access_token,
      role: data.user_role,
      userId: data.user_id,
    });
  };

  const logout = () => {
    localStorage.clear();
    console.log("Logged out");
    setAuth({ token: null, role: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
