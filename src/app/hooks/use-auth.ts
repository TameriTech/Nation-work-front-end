// hooks/auth/use-auth.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";
import * as authService from "@/app/services/auth.service";
import type { User } from "@/app/types";
import { useEffect, useState, useCallback } from "react";
import { ForgotPasswordFormData, LoginFormData, ResetPasswordFormData, SignUpFormData, VerifyResetTokenFormData } from "@/app/lib/validators";

// ==================== CLÉS DE QUERY ====================

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  
  // 🔥 État local pour forcer le re-render
  const [userState, setUserState] = useState<User | null>(() => {
    // Récupérer l'utilisateur depuis le cache au chargement
    if (typeof window !== "undefined") {
      const cached = queryClient.getQueryData<User>(authKeys.user());
      return cached || null;
    }
    return null;
  });
  
  // 🔥 État d'authentification local
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.cookie.includes("has_token=true") || !!queryClient.getQueryData(authKeys.user());
  });

  // ==================== QUERIES ====================

  const userQuery = useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        const data = await authService.getCurrentUser();
        
        let user = data?.data?.user || data?.data || data;
        
        if (user) {
          if (!user.username) {
            user.username = user.first_name || user.email?.split('@')[0] || 'User';
          }
          setIsAuthenticated(true);
          setUserState(user);
          queryClient.setQueryData(authKeys.user(), user);
          return user;
        }
        
        setIsAuthenticated(false);
        setUserState(null);
        return null;
      } catch (error) {
        if (error?.response?.status === 401) {
          setIsAuthenticated(false);
          setUserState(null);
          queryClient.setQueryData(authKeys.user(), null);
        }
        return null;
      }
    },
    enabled: true,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    initialData: () => {
      const cached = queryClient.getQueryData<User>(authKeys.user());
      return cached || undefined;
    },
  });

  // ==================== MUTATIONS ====================

  /**
   * Connexion
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => authService.login(credentials),
    
    onSuccess: async (loginResponse) => {
      const user = loginResponse?.data?.user || null;
      
      if (user) {
        if (!user.username) {
          user.username = user.first_name || user.email?.split('@')[0] || 'User';
        }
        
        // 🔥 Mettre à jour TOUS les états IMMÉDIATEMENT
        setIsAuthenticated(true);
        setUserState(user);
        queryClient.setQueryData(authKeys.user(), user);
        
        // 🔥 Forcer l'invalidation et le refetch
        await queryClient.invalidateQueries({ queryKey: authKeys.user() });
        await queryClient.refetchQueries({ queryKey: authKeys.user() });
        
        toast({
          title: "Connexion réussie ✨",
          description: `Bienvenue ${user?.first_name || "sur Tameri Work"}!`,
          variant: "default",
        });
        
        const userRole = user?.role;
        const roleRoutes: Record<string, string> = {
          admin: "/dashboard/admin",
          super_admin: "/dashboard/admin",
          provider: "/dashboard/provider",
          client: "/dashboard/customer",
        };
        
        const redirectPath = userRole && roleRoutes[userRole] 
          ? roleRoutes[userRole] 
          : "/dashboard";
        
        router.push(redirectPath);
      }
    },
    
    onError: (error: any) => {
      setIsAuthenticated(false);
      setUserState(null);
      queryClient.removeQueries({ queryKey: authKeys.user() });
      
      let errorMessage = "Email ou mot de passe incorrect";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Échec de la connexion",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    },
  });

  /**
   * Inscription
   */
  const registerMutation = useMutation({
    mutationFn: (userData: SignUpFormData) => authService.signUp(userData),
    
    onSuccess: async (data) => {
      toast({
        title: "Inscription réussie ✨",
        description: data.message || "Un code de vérification a été envoyé à votre email",
        variant: "default",
      });
      
      return data;
    },
    
    onError: (error: any) => {
      let errorMessage = "Erreur lors de l'inscription";
      let errors = null;
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      if (error?.response?.data?.errors) {
        errors = error.response.data.errors;
      } else if (error?.errors) {
        errors = error.errors;
      }
      
      throw {
        message: errorMessage,
        errors: errors,
        status: error?.response?.status || error?.status || 422,
      };
    },
  });

  /**
   * Vérification OTP
   */
  const verifyEmailMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => 
      authService.verifyOtp(email, code),
    
    onSuccess: async (verifyResponse) => {
      const user = verifyResponse?.data?.user || null;
      
      if (user) {
        if (!user.username) {
          user.username = user.first_name || user.email?.split('@')[0] || 'User';
        }
        
        // 🔥 Mettre à jour TOUS les états IMMÉDIATEMENT
        setIsAuthenticated(true);
        setUserState(user);
        queryClient.setQueryData(authKeys.user(), user);
        
        await queryClient.invalidateQueries({ queryKey: authKeys.user() });
        await queryClient.refetchQueries({ queryKey: authKeys.user() });
        
        toast({
          title: "✅ Compte vérifié",
          description: "Votre compte a été activé avec succès !",
          variant: "default",
        });
        
        const userRole = user?.role;
        const roleRoutes: Record<string, string> = {
          admin: "/dashboard/admin",
          super_admin: "/dashboard/admin",
          provider: "/dashboard/provider",
          client: "/dashboard/customer",
        };
        
        const redirectPath = userRole && roleRoutes[userRole] 
          ? roleRoutes[userRole] 
          : "/dashboard";
        
        router.push(redirectPath);
      } else {
        throw new Error(verifyResponse?.message || "Erreur de vérification");
      }
    },
    
    onError: (error: any) => {
      console.error("❌ Verification error:", error);
      
      let errorMessage = "Code OTP invalide ou expiré";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur de vérification",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    },
  });

  /**
   * Renvoyer l'OTP
   */
  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => authService.resendOtp(email),
    
    onSuccess: (data) => {
      toast({
        title: "Code renvoyé",
        description: data.message || "Un nouveau code a été envoyé à votre email",
        variant: "default",
      });
    },
    
    onError: (error: any) => {
      console.error("❌ Resend OTP error:", error);
      
      let errorMessage = "Impossible de renvoyer le code";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    },
  });

  /**
   * 🔥 Demande de réinitialisation de mot de passe (Forgot Password)
   */
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: ForgotPasswordFormData) => authService.forgotPassword(email),
    
    onSuccess: (data) => {
      
      toast({
        title: "Email envoyé ✨",
        description: data.message || "Un lien de réinitialisation a été envoyé à votre email",
        variant: "default",
      });
      
      return data;
    },
    
    onError: (error: any) => {
      console.error("❌ Forgot password error:", error);
      
      let errorMessage = "Erreur lors de l'envoi de l'email";
      let errors = null;
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      if (error?.response?.data?.errors) {
        errors = error.response.data.errors;
      } else if (error?.errors) {
        errors = error.errors;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw {
        message: errorMessage,
        errors: errors,
        status: error?.response?.status || error?.status || 422,
      };
    },
  });

  /**
   * 🔥 Vérification du token de réinitialisation
   */
  const verifyResetTokenMutation = useMutation({
    mutationFn: (formData: VerifyResetTokenFormData) => 
      authService.verifyResetToken(formData),
    
    onSuccess: (data) => {
      return data;
    },
    
    onError: (error: any) => {
      throw error;
    },
  });

  /**
   * 🔥 Réinitialisation complète du mot de passe
   */
  const resetPasswordMutation = useMutation({
    mutationFn: (formData: ResetPasswordFormData) => 
      authService.resetPassword(formData),
    
    onSuccess: async (data) => {
      
      if (data.success && data.data?.user) {
        const user = data.data.user;
        
        if (!user.username) {
          user.username = user.first_name || user.email?.split('@')[0] || 'User';
        }
        
        // 🔥 Mettre à jour TOUS les états IMMÉDIATEMENT
        setIsAuthenticated(true);
        setUserState(user);
        queryClient.setQueryData(authKeys.user(), user);
        
        await queryClient.invalidateQueries({ queryKey: authKeys.user() });
        await queryClient.refetchQueries({ queryKey: authKeys.user() });
        
        toast({
          title: "✅ Mot de passe réinitialisé",
          description: "Votre mot de passe a été mis à jour avec succès",
          variant: "default",
        });
        
        const userRole = user?.role;
        const roleRoutes: Record<string, string> = {
          admin: "/dashboard/admin",
          super_admin: "/dashboard/admin",
          provider: "/dashboard/provider",
          client: "/dashboard/customer",
        };
        
        const redirectPath = userRole && roleRoutes[userRole] 
          ? roleRoutes[userRole] 
          : "/dashboard";
        
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      } else {
        toast({
          title: "✅ Mot de passe réinitialisé",
          description: data.message || "Votre mot de passe a été mis à jour avec succès",
          variant: "default",
        });
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
      
      return data;
    },
    
    onError: (error: any) => {
      console.error("❌ Reset password error:", error);
      throw error;
    },
  });

  /**
   * Déconnexion
   */
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    
    onSuccess: () => {
      setIsAuthenticated(false);
      setUserState(null);
      queryClient.clear();
      
      // 🔥 Supprimer le cookie has_token
      document.cookie = "has_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
        variant: "default",
      });
      
      router.push("/auth/login");
    },
    
    onError: (error: any) => {
      console.error("❌ Logout error:", error);
      setIsAuthenticated(false);
      setUserState(null);
      queryClient.clear();
      document.cookie = "has_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/auth/login");
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  const hasRole = useCallback((roles: string | string[]): boolean => {
    const currentUser = userState || userQuery.data;
    if (!currentUser) return false;
    const userRole = currentUser.role;
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return userRole === roles;
  }, [userState, userQuery.data]);

  const isProvider = useCallback(() => {
    const currentUser = userState || userQuery.data;
    return currentUser?.role === "provider";
  }, [userState, userQuery.data]);

  const isClient = useCallback(() => {
    const currentUser = userState || userQuery.data;
    return currentUser?.role === "client";
  }, [userState, userQuery.data]);

  const isAdmin = useCallback(() => {
    const currentUser = userState || userQuery.data;
    return currentUser?.role === "admin" || currentUser?.role === "super_admin";
  }, [userState, userQuery.data]);

  const isSuperAdmin = useCallback(() => {
    const currentUser = userState || userQuery.data;
    return currentUser?.role === "super_admin";
  }, [userState, userQuery.data]);

  const refetchUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.user() });
    await queryClient.refetchQueries({ queryKey: authKeys.user() });
    
    // 🔥 Mettre à jour l'état local après le refetch
    const freshUser = queryClient.getQueryData<User>(authKeys.user());
    if (freshUser) {
      setUserState(freshUser);
      setIsAuthenticated(true);
    }
    return freshUser;
  }, [queryClient]);

  const setUser = useCallback((user: User | null) => {
    setUserState(user);
    queryClient.setQueryData(authKeys.user(), user);
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [queryClient]);

  // 🔥 Synchroniser userState avec le cache de React Query
  useEffect(() => {
    const cachedUser = queryClient.getQueryData<User>(authKeys.user());
    if (cachedUser && !userState) {
      setUserState(cachedUser);
      setIsAuthenticated(true);
    }
  }, [queryClient, userState]);

  // ==================== RETOUR DU HOOK ====================

  return {
    // 🔥 Utiliser userState comme source principale
    user: userState || userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,

    isAuthenticated,
    
    // Rôles
    hasRole,
    isProvider,
    isClient,
    isAdmin,
    isSuperAdmin,

    // Mutations - Login
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Mutations - Register
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Mutations - Verify OTP
    verifyEmail: verifyEmailMutation.mutate,
    isVerifying: verifyEmailMutation.isPending,
    verifyError: verifyEmailMutation.error,

    // Mutations - Resend OTP
    resendVerification: resendVerificationMutation.mutate,
    isResending: resendVerificationMutation.isPending,
    resendError: resendVerificationMutation.error,

    // Mutations - Forgot Password
    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    // Mutations - Verify Reset Token
    verifyResetToken: verifyResetTokenMutation.mutateAsync,
    isVerifyingResetToken: verifyResetTokenMutation.isPending,
    verifyResetTokenError: verifyResetTokenMutation.error,

    // Mutations - Reset Password
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // Mutations - Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // Utilitaires
    refetchUser,
    setUser,
  };
};