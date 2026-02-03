// Auth

import { apiClient } from "@/app/lib/api-client";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: "client" | "freelancer" | "admin";
  avatar?: string;
}


export interface LoginPayload {
  email: string;
  password: string;
}


interface LoginResponse {
    access_token: string;
    token_type: string;
    user_role: "client" | "freelancer" | "admin";
    user_id: number;
}