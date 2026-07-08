import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as userService from '@/app/services/users.service';
import type {
  User,
  UserFilters,
  BlockHistoryEntry,
} from '@/app/types/auth/user';
import type {
  BlockUserFormData,
  UnblockFormData,
  UserRoleUpdateFormData,
} from '@/app/lib/validators/user.validator';

// ==================== QUERY KEYS ====================

export const adminUserKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (filters?: UserFilters) => [...adminUserKeys.lists(), filters] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminUserKeys.details(), id] as const,
  blockHistory: (id: string) => [...adminUserKeys.detail(id), 'block-history'] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useAdminUsers = (filters?: UserFilters) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query pour récupérer les utilisateurs
  const usersQuery = useQuery({
    queryKey: adminUserKeys.list(filters),
    queryFn: () => userService.getAllUsers(filters),
    staleTime: 5 * 60 * 1000,
  });

  // Extract data from the response
  const responseData = usersQuery.data;

  // Mutations...
  const blockUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data?: BlockUserFormData }) =>
      userService.blockUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.blockHistory(variables.userId) });
      
      toast({
        title: 'Utilisateur bloqué',
        description: 'L\'utilisateur a été bloqué avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de bloquer l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data?: UnblockFormData }) =>
      userService.unblockUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.blockHistory(variables.userId) });
      
      toast({
        title: 'Utilisateur débloqué',
        description: 'L\'utilisateur a été débloqué avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de débloquer l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserRoleUpdateFormData }) =>
      userService.changeUserRole(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
      
      toast({
        title: 'Rôle modifié',
        description: 'Le rôle de l\'utilisateur a été modifié avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de changer le rôle',
        variant: 'destructive',
      });
    },
  });

  const verifyUserMutation = useMutation({
    mutationFn: (userId: string) => userService.verifyUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      
      toast({
        title: 'Utilisateur vérifié',
        description: 'L\'utilisateur a été vérifié avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de vérifier l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  return {
    // Données - using 'items' instead of 'data'
    users: responseData?.items || [],
    pagination: responseData ? {
      page: responseData.page,
      total: responseData.total,
      total_pages: responseData.total_pages,
      per_page: responseData.per_page,
    } : null,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    refetch: usersQuery.refetch,

    // Mutations
    blockUser: blockUserMutation.mutate,
    isBlocking: blockUserMutation.isPending,

    unblockUser: unblockUserMutation.mutate,
    isUnblocking: unblockUserMutation.isPending,

    changeRole: changeRoleMutation.mutate,
    isChangingRole: changeRoleMutation.isPending,

    verifyUser: verifyUserMutation.mutate,
    isVerifying: verifyUserMutation.isPending,
  };
};

// ==================== HOOK POUR LES DÉTAILS D'UN UTILISATEUR ====================

export const useAdminUser = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const userQuery = useQuery({
    queryKey: adminUserKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const blockHistoryQuery = useQuery({
    queryKey: adminUserKeys.blockHistory(userId),
    queryFn: () => userService.getUserBlockHistory(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const blockUserMutation = useMutation({
    mutationFn: (data?: BlockUserFormData) => userService.blockUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.blockHistory(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({ title: 'Utilisateur bloqué' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de bloquer l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: (data?: UnblockFormData) => userService.unblockUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.blockHistory(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({ title: 'Utilisateur débloqué' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de débloquer l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: (data: UserRoleUpdateFormData) => userService.changeUserRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({ title: 'Rôle modifié' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de changer le rôle',
        variant: 'destructive',
      });
    },
  });

  const verifyUserMutation = useMutation({
    mutationFn: () => userService.verifyUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({ title: 'Utilisateur vérifié' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de vérifier l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  return {
    user: userQuery.data?.user,
    statistics: userQuery.data?.statistics,
    blockHistory: blockHistoryQuery.data || [],
    isLoading: userQuery.isLoading || blockHistoryQuery.isLoading,
    error: userQuery.error,
    refetch: userQuery.refetch,
    refetchBlockHistory: blockHistoryQuery.refetch,

    blockUser: blockUserMutation.mutate,
    isBlocking: blockUserMutation.isPending,

    unblockUser: unblockUserMutation.mutate,
    isUnblocking: unblockUserMutation.isPending,

    changeRole: changeRoleMutation.mutate,
    isChangingRole: changeRoleMutation.isPending,

    verifyUser: verifyUserMutation.mutate,
    isVerifying: verifyUserMutation.isPending,
  };
};