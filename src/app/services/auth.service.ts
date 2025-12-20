import { apiClient } from "@/app/lib/http/client";

export const AuthService = {
  login: (data: { email: string; password: string }) =>
    apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient("/auth/logout", { method: "POST" }),

  me: () =>
    apiClient("/auth/me"),
};
