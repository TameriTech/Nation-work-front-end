"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser]);

  return <>{children}</>;
}
