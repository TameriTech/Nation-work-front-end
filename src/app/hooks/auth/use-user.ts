// hooks/auth/useUser.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as userService from '@/app/services/users.service';
import type { 
  User, 
  UpdateFreelancerProfileData,
  UpdateFreelancerProfileDto 
} from '@/app/types';

// ==================== CLÉS DE QUERY ====================

export const userKeys = {
  all: ['users'] as const,
  profile: (userId: number) => [...userKeys.all, 'profile', userId] as const,
  freelancerProfile: (userId: number) => [...userKeys.all, 'freelancer', userId] as const,
  publicProfile: (userId: number) => [...userKeys.all, 'public', userId] as const,
  search: (filters: any) => [...userKeys.all, 'search', filters] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useUser = (userId?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère le profil d'un utilisateur par son ID
   */
  const profileQuery = useQuery({
    queryKey: userKeys.profile(userId || 0),
    queryFn: () => userService.getUserById(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère le profil public d'un freelancer
   */
  const freelancerPublicProfileQuery = useQuery({
    queryKey: userKeys.publicProfile(userId || 0),
    queryFn: () => userService.getFreelancerPublicProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Mettre à jour le profil utilisateur
   */
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(updatedUser.id) });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été modifiées avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    },
  });

  /**
   * Uploader une photo de profil
   */
  const uploadAvatarMutation = useMutation({
    mutationFn: ({ userId, file }: { userId: number; file: File }) =>
      userService.uploadAvatar(file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(variables.userId) });
      
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été modifiée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'uploader la photo",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprimer le compte utilisateur
   */
  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => userService.deleteMyAccount(password),
    onSuccess: () => {
      queryClient.clear();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });
      
      // Redirection vers la page d'accueil
      window.location.href = '/';
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le compte",
        variant: "destructive",
      });
    },
  });

  /**
   * Changer le mot de passe
   */
  const changePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      userService.changePassword(data),
    onSuccess: () => {
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le mot de passe",
        variant: "destructive",
      });
    },
  });

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error,

    freelancerPublicProfile: freelancerPublicProfileQuery.data,
    isLoadingPublicProfile: freelancerPublicProfileQuery.isLoading,

    // Mutations
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,

    uploadAvatar: uploadAvatarMutation.mutate,
    isUploading: uploadAvatarMutation.isPending,

    deleteAccount: deleteAccountMutation.mutate,
    isDeleting: deleteAccountMutation.isPending,

    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,

    // Rafraîchissement
    refetchProfile: () => queryClient.invalidateQueries({ 
      queryKey: userKeys.profile(userId || 0) 
    }),
  };
};

// ==================== HOOK POUR LE PROFIL FREELANCER ====================

export const useFreelancerProfile = (userId?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère le profil complet du freelancer (pour le freelancer lui-même)
   */
  const myProfileQuery = useQuery({
    queryKey: userKeys.freelancerProfile(userId || 0),
    queryFn: () => userService.getMyFreelancerProfile(),
    enabled: !userId, // Si pas d'userId, c'est le profil de l'utilisateur connecté
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère le profil public d'un freelancer (pour les clients)
   */
  const publicProfileQuery = useQuery({
    queryKey: userKeys.publicProfile(userId || 0),
    queryFn: () => userService.getFreelancerPublicProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Mettre à jour le profil freelancer
   */
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateFreelancerProfileData) =>
      userService.updateMyFreelancerProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ 
        queryKey: userKeys.freelancerProfile(updatedProfile.userId) 
      });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations professionnelles ont été modifiées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    },
  });

  /**
   * Mettre à jour des champs spécifiques du profil
   */
  const updateProfileFields = (fields: UpdateFreelancerProfileDto) => {
    const currentProfile = userId ? publicProfileQuery.data : myProfileQuery.data;
    if (!currentProfile) return;

    updateProfileMutation.mutate({
      ...currentProfile,
      ...fields,
    });
  };

  // ==================== RETOUR DU HOOK ====================

  const profile = userId ? publicProfileQuery.data : myProfileQuery.data;
  const isLoading = userId ? publicProfileQuery.isLoading : myProfileQuery.isLoading;
  const error = userId ? publicProfileQuery.error : myProfileQuery.error;

  return {
    // Données
    profile,
    isLoading,
    error,

    // Mutations
    updateProfile: updateProfileMutation.mutate,
    updateProfileFields,
    isUpdating: updateProfileMutation.isPending,

    // Rafraîchissement
    refetch: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.publicProfile(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: userKeys.freelancerProfile(0) });
      }
    },
  };
};

// ==================== HOOK POUR LA RECHERCHE DE FREELANCERS ====================

export const useFreelancerSearch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Rechercher des freelancers avec filtres
   */
  const searchQuery = useQuery({
    queryKey: userKeys.search({}),
    queryFn: () => userService.searchFreelancers({}),
    enabled: false, // Désactivé par défaut, on l'active manuellement
  });

  const search = async (filters: Parameters<typeof userService.searchFreelancers>[0]) => {
    try {
      const results = await userService.searchFreelancers(filters);
      
      // Mettre en cache les résultats
      queryClient.setQueryData(userKeys.search(filters), results);
      
      return results;
    } catch (error: any) {
      toast({
        title: "Erreur de recherche",
        description: error.message || "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    search,
    results: searchQuery.data || [],
    isLoading: searchQuery.isFetching,
  };
};

// ==================== HOOK POUR LES STATISTIQUES UTILISATEUR ====================

export const useUserStats = (userId: number) => {
  /**
   * Récupère les statistiques d'un utilisateur
   */
  const statsQuery = useQuery({
    queryKey: [...userKeys.all, 'stats', userId],
    queryFn: () => userService.getUserStats(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
  };
};

// ==================== HOOK POUR L'HISTORIQUE UTILISATEUR ====================

export const useUserHistory = (userId: number, filters?: {
  type?: 'service' | 'payment' | 'message';
  from?: string;
  to?: string;
  limit?: number;
}) => {
  /**
   * Récupère l'historique des actions d'un utilisateur
   */
  const historyQuery = useQuery({
    queryKey: [...userKeys.all, 'history', userId, filters],
    queryFn: () => userService.getUserHistory(userId, filters),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    error: historyQuery.error,
    refetch: historyQuery.refetch,
  };
};
