// hooks/admin/use-admin-users.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as adminService from '@/app/services/users.service';
import type { User, UserFilters } from '@/app/types/admin';

export const adminUserKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...adminUserKeys.lists(), filters] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminUserKeys.details(), id] as const,
};

export const useAdminUsers = (filters?: UserFilters) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query pour récupérer les utilisateurs
  const usersQuery = useQuery({
    queryKey: adminUserKeys.list(filters || {}),
    queryFn: () => adminService.getAllUsers(filters),
    staleTime: 5 * 60 * 1000,
  });

  // Mutation pour suspendre un utilisateur
  const suspendUserMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      adminService.blockUser(userId, false, reason || "Suspension par l'administrateur"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({
        title: "Utilisateur suspendu",
        description: "L'utilisateur a été suspendu avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de suspendre l'utilisateur",
        variant: "destructive",
      });
    },
  });

  // Mutation pour activer un utilisateur
  const activateUserMutation = useMutation({
    mutationFn: (userId: number) => adminService.blockUser(userId, true, "Activation par l'administrateur"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({
        title: "Utilisateur activé",
        description: "L'utilisateur a été activé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'activer l'utilisateur",
        variant: "destructive",
      });
    },
  });

  // Mutation pour changer le rôle
  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      adminService.changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({
        title: "Rôle modifié",
        description: "Le rôle de l'utilisateur a été modifié",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le rôle",
        variant: "destructive",
      });
    },
  });

  return {
    // Données - l'API retourne directement un tableau
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    refetch: usersQuery.refetch,

    // Mutations
    suspendUser: suspendUserMutation.mutate,
    isSuspending: suspendUserMutation.isPending,
    activateUser: activateUserMutation.mutate,
    isActivating: activateUserMutation.isPending,
    changeUserRole: changeRoleMutation.mutate,
    isChangingRole: changeRoleMutation.isPending,
  };
};