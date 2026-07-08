// ==================== AUTHENTIFICATION ====================

import {
    User,
    VerifyOtpResponse,
    SignUpResponse,
    ResendOtpResponse,
    GetCurrentUserResponse,
    ForgotPasswordResponse,
    PasswordResetVerifyResponse,
    PasswordResetCompleteResponse,
} from "@/app/types";
import {  
  SignUpSchema,
  ChangePasswordSchema,
  EmailChangeSchema,
  EmailChangeVerifySchema,
  ProfileUpdateSchema,
  ChangePasswordFormData,
  EmailChangeFormData,
  EmailChangeVerifyFormData,
  ProfileUpdateFormData,
  LoginFormData,
  ForgotPasswordFormData,
  VerifyResetTokenFormData,
  ResetPasswordFormData,

} from "../lib/validators";
import { handleResponse } from "../lib/error-handler";

/**
 * Inscription - Étape 1: Création du compte
 */
export async function signUp(userData: any): Promise<SignUpResponse> {
  try {
    // Validation Zod...
    const validatedData = SignUpSchema.parse(userData);
    
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    const data = await res.json();

    if (!res.ok) {
      // Les erreurs sont déjà formatées par handleApiError
      // mais on s'assure que le format est cohérent
      throw {
        status: res.status,
        message: data.message || "Erreur lors de l'inscription",
        errors: data.errors || data.field, // Support des deux formats
        code: data.code
      };
    }

    return data;
  } catch (error: any) {
    // Si c'est déjà une erreur formatée
    if (error.status && error.errors) {
      throw error;
    }
    
    // Erreur Zod
    if (error.name === 'ZodError') {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      throw {
        status: 422,
        message: "Erreur de validation des données",
        errors: errors,
        code: 'validation_error'
      };
    }
    
    // Erreur générique
    throw {
      status: 500,
      message: error.message || "Une erreur est survenue",
      code: 'unknown_error'
    };
  }
}

/**
 * Vérification OTP - Étape 2
 */
export async function verifyOtp(email: string, code: string): Promise<VerifyOtpResponse> {
  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur de vérification");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Renvoyer l'OTP
 */
export async function resendOtp(email: string): Promise<ResendOtpResponse> {
  try {
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors du renvoi");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Connexion
 */
export async function login(credentials: LoginFormData): Promise<any> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Erreur de connexion");
      (error as any).status = res.status;
      (error as any).response = { data, status: res.status };
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}






/**
 * Demander une réinitialisation de mot de passe
 */
export async function forgotPassword(formData: ForgotPasswordFormData): Promise<ForgotPasswordResponse> {
  try {
    
    const res = await fetch("/api/auth/password/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),

    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Erreur lors de la demande");
      (error as any).status = res.status;
      (error as any).response = { data, status: res.status };
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Vérifier le token de réinitialisation
 */
export async function verifyResetToken(formData: VerifyResetTokenFormData): Promise<PasswordResetVerifyResponse> {
  try {
    
    const res = await fetch("/api/auth/password/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, token: formData.token }),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Token invalide");
      (error as any).status = res.status;
      (error as any).response = { data, status: res.status };
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Réinitialiser le mot de passe
 */

export async function resetPassword(formData: ResetPasswordFormData): Promise<any> {
  try {
    
    const res = await fetch("/api/auth/password/reset-complete", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formData),
    });

    
    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Erreur lors de la réinitialisation");
      (error as any).status = res.status;
      (error as any).response = data;
      (error as any).errors = data.errors;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}



/**
 * Récupérer l'utilisateur actuel
 */
export async function getCurrentUser(): Promise<GetCurrentUserResponse | null> {
  try {
    
    const res = await fetch("/api/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });


    if (res.status === 401) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    const response = await res.json();
    
    // 🔥 Extraire l'utilisateur de la structure { success: true, data: { user: ... } }
    const user = response?.data?.user || null;
    
    if (!user) {
      return null;
    }
    
    // S'assurer que l'utilisateur a un username
    if (!user.username) {
      user.username = user.first_name || 
                     user.email?.split('@')[0] || 
                     'User';
    }
    
    return user;
  } catch (error) {
    console.error("❌ Get current user error:", error);
    return null;
  }
}


/**
 * Déconnexion
 */
export async function logout(): Promise<{ message: string }> {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur logout:", error);
    throw error;
  }
}


// ================ Profile Management ==========================
/**
 * Mettre à jour l'avatar de l'utilisateur
 */
export async function uploadAvatar(file: File): Promise<User> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch("/api/auth/avatar", {
      method: "POST",
      body: formData,
    });
    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur uploadAvatar:", error);
    throw error;
  }
}



/**
 * Changer le mot de passe
 */
export async function changePassword(data: ChangePasswordFormData): Promise<{ message: string }> {
  try {
    const validatedData = ChangePasswordSchema.parse(data);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur changePassword:", error);
    throw error;
  }
}


export async function requestEmailChange(data: EmailChangeFormData): Promise<{ message: string }> {
  try {
    const validatedData = EmailChangeSchema.parse(data);
    const res = await fetch("/api/auth/request-email-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur requestEmailChange:", error);
    throw error;
  }
}

export async function verifyEmailChange(data: EmailChangeVerifyFormData): Promise<{ message: string }> {
  try {
    const validatedData = EmailChangeVerifySchema.parse(data);
    const res = await fetch("/api/auth/verify-email-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur verifyEmailChange:", error);
    throw error;
  }
}

export async function updateProfile(data: ProfileUpdateFormData): Promise<User> {
  try {
    const validatedData = ProfileUpdateSchema.parse(data);
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur updateProfile:", error);
    throw error;
  }
}

export async function deleteMyAccount(password: string): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/auth/account?password=${encodeURIComponent(password)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur deleteMyAccount:", error);
    throw error;
  }
}

export async function refreshToken(): Promise<{ message: string }> {
  try {
    const res = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur refreshToken:", error);
    throw error;
  }
}

