import { apiClient } from "@/app/lib/api-client";

export interface RegisterPayload {
  role: "client" | "freelancer";
  username: string;
  email: string;
  password: string;
  categories?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  user_role: "client" | "freelancer" | "admin";
  access_token: string;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    user_role: "client" | "freelancer" | "admin";
    user_id: number;
}

export function register(payload: RegisterPayload) {
  return apiClient<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiClient<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return true; /*apiClient<void>("/auth/logout", {
    method: "POST",
  });*/
}

export function getMe() {
  return apiClient<User>("/auth/me");
}
