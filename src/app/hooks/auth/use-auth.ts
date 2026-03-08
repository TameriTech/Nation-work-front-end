// hooks/auth/useAuth.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/use-toast';
import * as authService from '@/app/services/auth.service';
import * as userService from '@/app/services/users.service';
import type {
  LoginCredentials, 
  SignUpData,
} from '@/app/types';
import { useEffect, useState } from 'react';

// ==================== CLÉS DE QUERY ====================

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  role: () => [...authKeys.all, 'role'] as const,
  permissions: () => [...authKeys.all, 'permissions'] as const,
};

// ==================== FONCTION UTILITAIRE ====================

const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('access_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// ==================== HOOK PRINCIPAL ====================

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  // Vérifier la présence du token au chargement
  useEffect(() => {
    setHasToken(!!getTokenFromCookie());
  }, []);

  // ==================== QUERIES ====================

  /**
   * Récupère l'utilisateur connecté - UNIQUEMENT si token présent
   */
  const userQuery = useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        return await userService.getCurrentUser();
      } catch (error) {
        return null;
      }
    },
    enabled: hasToken === true, // ← CRITIQUE : Ne tourne que si token présent
    retry: false,
    staleTime: 1000 * 60 * 30, // 30 minutes - plus long
    gcTime: 1000 * 60 * 60, // 1 heure
    refetchOnWindowFocus: false, // ← Évite les refetch au focus
    refetchOnReconnect: false, // ← Évite les refetch à la reconnexion
    refetchInterval: false, // ← Pas de polling
  });

  /**
   * Récupère le profil complet du freelancer si l'utilisateur est un freelancer
   */
  const freelancerProfileQuery = useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => userService.getMyFreelancerProfile(),
    enabled: userQuery.data?.role === 'freelancer' && !!userQuery.data,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  /**
   * Vérifie le rôle de l'utilisateur
   */
  const roleQuery = useQuery({
    queryKey: authKeys.role(),
    queryFn: () => authService.verifyRole(),
    enabled: !!userQuery.data,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  // ==================== MUTATIONS ====================

  /**
   * Connexion
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => userService.login(credentials),
    onSuccess: async (data: any) => {
      setHasToken(true); // ← Mettre à jour l'état du token
      await queryClient.invalidateQueries({ queryKey: authKeys.all });

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Nation Work",
      });

      console.log("Rôle de l'utilisateur:", data.user.role); // ← Log du rôle pour le debug

      // Rediriger en fonction du rôle
      if (data.user.role === 'admin' || data.user.role === 'super_admin') {
        router.push('/dashboard/admin');
      } else if (data.user.role === 'freelancer') {
        router.push('/dashboard/freelancer');
      } else if (data.user.role === 'client') {
        router.push('/dashboard/customer');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    },
  });

  /**
   * Inscription
   */
  const registerMutation = useMutation({
    mutationFn: (userData: SignUpData) => userService.signUp(userData),
    onSuccess: async (data) => {
      setHasToken(true);
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });

      // Rediriger vers la page appropriée
      if (data.role === 'freelancer') {
        router.push('/freelancer/profile/edit');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  /**
   * Déconnexion
   */
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      setHasToken(false); // ← Mettre à jour l'état du token
      queryClient.clear();
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });

      router.push('/login');
    },
    onError: (error: any) => {
      console.error('Erreur déconnexion:', error);
      setHasToken(false);
      queryClient.clear();
      router.push('/login');
    },
  });

  /**
   * Rafraîchir le token
   */
  const refreshTokenMutation = useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: any) => {
      console.error('Erreur rafraîchissement token:', error);
      setHasToken(false);
      logoutMutation.mutate();
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = (roles: string | string[]): boolean => {
    if (!userQuery.data) return false;
    
    const userRole = userQuery.data.role;
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    
    return userRole === roles;
  };

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  const isAuthenticated = !!userQuery.data && !userQuery.isLoading;

  /**
   * Vérifie si l'utilisateur est un freelancer
   */
  const isFreelancer = hasRole('freelancer');

  /**
   * Vérifie si l'utilisateur est un client
   */
  const isClient = hasRole('client');

  /**
   * Vérifie si l'utilisateur est un admin
   */
  const isAdmin = hasRole(['admin', 'super_admin']);

  /**
   * Vérifie si l'utilisateur est un super admin
   */
  const isSuperAdmin = hasRole('super_admin');

  // ==================== RETOUR DU HOOK ====================

  return {
    // Utilisateur
    user: userQuery.data,
    isLoading: userQuery.isLoading || hasToken === null, // ← Attendre la vérification du token
    isError: userQuery.isError,
    error: userQuery.error,

    // Profil freelancer
    freelancerProfile: freelancerProfileQuery.data,
    isFreelancerProfileLoading: freelancerProfileQuery.isLoading,

    // Rôle
    role: roleQuery.data?.role,
    hasRole,
    isAuthenticated,
    isFreelancer,
    isClient,
    isAdmin,
    isSuperAdmin,

    // Mutations
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    
    refreshToken: refreshTokenMutation.mutate,
    isRefreshing: refreshTokenMutation.isPending,

    // Rafraîchissement manuel
    refetchUser: () => queryClient.invalidateQueries({ queryKey: authKeys.user() }),
    refetchProfile: () => queryClient.invalidateQueries({ queryKey: authKeys.profile() }),
  };
};


// ==================== HOOKS SPÉCIALISÉS ====================

/**
 * Hook pour protéger les routes (redirige si non authentifié)
 */
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook pour protéger les routes par rôle
 */
export const useRequireRole = (
  requiredRoles: string | string[],
  redirectTo: string = '/dashboard'
) => {
  const { hasRole, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!hasRole(requiredRoles)) {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, hasRole, requiredRoles, redirectTo, router]);

  const authorized = isAuthenticated && hasRole(requiredRoles);
  
  return { authorized, isLoading };
};

/**
 * Hook pour vérifier si l'utilisateur est un freelancer
 */
export const useIsFreelancer = () => {
  const { user, isLoading } = useAuth();
  return {
    isFreelancer: user?.role === 'freelancer',
    isLoading,
  };
};

/**
 * Hook pour vérifier si l'utilisateur est un client
 */
export const useIsClient = () => {
  const { user, isLoading } = useAuth();
  return {
    isClient: user?.role === 'client',
    isLoading,
  };
};

/**
 * Hook pour vérifier si l'utilisateur est un admin
 */
export const useIsAdmin = () => {
  const { user, isLoading } = useAuth();
  return {
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isLoading,
  };
};
