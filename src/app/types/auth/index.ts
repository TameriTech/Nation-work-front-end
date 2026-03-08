import { User } from "./user";

// ============================================================================
// TYPES POUR L'AUTHENTIFICATION
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  first_name: string;
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
}

export interface SignUpData {
  email: string;
  username: string;
  password: string;
  role: 'client' | 'freelancer';
  phoneNumber?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_role: string;
  user_id: number;
}

export interface LoginResponse extends User {
  access_token: string;
  token_type: string;
}

export * from "./user";
