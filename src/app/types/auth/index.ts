import { UserRole } from "../enums";
import { UserBase, UserOut } from "./user";

// ============================================================================
// TYPES POUR L'AUTHENTIFICATION
// ============================================================================


export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    user_role: UserRole;
    user_id: number;
    user: UserBase;
}

// Type pour la réponse d'inscription
export interface SignUpResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    verification_type: string;
    email: string;
    expires_at: string | null;
    remaining_attempts: number;
  };
}

export interface GetCurrentUserResponse {
  success: true,
  data: {
    user: UserOut;
  }
};

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: UserOut;
    token: string;
    token_type: string;
    verified_at: string;
  };
}

// Type pour renvoyer l'OTP
export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: {
    expires_at: string | null;
    remaining_attempts: number;
  };
}


export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: UserOut;
    token: string;
    token_type: string;
    expires_in: number;
  };
}


export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    expires_in: number;
  }
}


export interface PasswordResetVerifyResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    token: string;
  }
}

export interface PasswordResetCompleteResponse {
  success: boolean;
  message: string;
  data: {
    user: UserOut;
    token: string;
    token_type: string;
  }
}

export * from "./user";