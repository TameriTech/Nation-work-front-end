export interface RegisterPayload {
  name: string;
  first_name: string;
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
    id: number;
    name: string;
    first_name: string;
    email: string;
    avatar: string | null;
    email_verified_at: string | null;
    is_locked: boolean;
    locked_at: string | null;
    roles: Array<string>;
    created_at: string;
    updated_at: string;

}

export interface LoginResponse extends User {
    access_token: string;
    token_type: string;
}