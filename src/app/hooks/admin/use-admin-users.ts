// hooks/admin/use-admin-users.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as adminService from '@/app/services/users.service';
import type { 
  User, 
  UserFilters,
  EmailData,
  SuspendData
} from '@/app/types';
import { format } from 'path';
import { SuspendFormData, UnblockFormData } from '@/app/lib/validators';

export const adminUserKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...adminUserKeys.lists(), filters] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminUserKeys.details(), id] as const,
  services: (id: number) => [...adminUserKeys.detail(id), 'services'] as const,
  payments: (id: number) => [...adminUserKeys.detail(id), 'payments'] as const,
  disputes: (id: number) => [...adminUserKeys.detail(id), 'disputes'] as const,
  logs: (id: number) => [...adminUserKeys.detail(id), 'logs'] as const,
  stats: () => [...adminUserKeys.all, 'stats'] as const,
};

// Hook principal pour la liste des utilisateurs
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
    mutationFn: ({ userId, data }: { userId: number; data: SuspendFormData }) =>
      adminService.blockUser(userId, data ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
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
    mutationFn: ({ userId, data }: { userId: number; data: UnblockFormData }) => adminService.unblockUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.userId) });
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

  // Mutation pour envoyer un email
  const sendEmailMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: EmailData }) =>
      adminService.sendUserEmail(userId, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Email envoyé",
        description: `L'email a été envoyé à l'utilisateur`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email",
        variant: "destructive",
      });
    },
  });

  // Mutation pour supprimer un utilisateur (soft delete)
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => adminService.deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    },
  });

  return {
    // Données
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
    sendEmail: sendEmailMutation.mutate,
    isSendingEmail: sendEmailMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
  };
};

// Hook pour les détails d'un utilisateur spécifique
export const useAdminUser = (userId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query pour récupérer les détails de l'utilisateur
  const userQuery = useQuery({
    queryKey: adminUserKeys.detail(userId),
    queryFn: () => adminService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Query pour l'historique des services
  const servicesQuery = useQuery({
    queryKey: adminUserKeys.services(userId),
    queryFn: () => adminService.getUserServicesHistory(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Query pour l'historique des paiements
  const paymentsQuery = useQuery({
    queryKey: adminUserKeys.payments(userId),
    queryFn: () => adminService.getUserPaymentsHistory(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Query pour l'historique des litiges
  const disputesQuery = useQuery({
    queryKey: adminUserKeys.disputes(userId),
    queryFn: () => adminService.getUserDisputesHistory(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Query pour le journal d'activité
  const logsQuery = useQuery({
    queryKey: adminUserKeys.logs(userId),
    queryFn: () => adminService.getUserActivityLogs(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });

  // Mutation pour suspendre l'utilisateur
  const suspendUserMutation = useMutation({
    mutationFn: (data: SuspendFormData) =>
      adminService.blockUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
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

  // Mutation pour activer l'utilisateur
  const activateUserMutation = useMutation({
    mutationFn: (data: UnblockFormData) => adminService.unblockUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({
        title: "Utilisateur activé",
        description: "L'utilisateur a été réactivé avec succès",
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
    mutationFn: (role: string) => adminService.changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
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

  // Mutation pour envoyer un email
  const sendEmailMutation = useMutation({
    mutationFn: (data: EmailData) => adminService.sendUserEmail(userId, data),
    onSuccess: () => {
      toast({
        title: "Email envoyé",
        description: "L'email a été envoyé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => adminService.updateUserProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({
        title: "Profil mis à jour",
        description: "Les informations ont été mises à jour avec succès",
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

  // Mutation pour vérifier l'utilisateur
  const verifyUserMutation = useMutation({
    mutationFn: () => adminService.verifyUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      toast({
        title: "Utilisateur vérifié",
        description: "L'utilisateur a été vérifié avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de vérifier l'utilisateur",
        variant: "destructive",
      });
    },
  });

  return {
    // Données
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    services: servicesQuery.data || [],
    servicesLoading: servicesQuery.isLoading,
    payments: paymentsQuery.data || [],
    paymentsLoading: paymentsQuery.isLoading,
    disputes: disputesQuery.data || [],
    disputesLoading: disputesQuery.isLoading,
    logs: logsQuery.data || [],
    logsLoading: logsQuery.isLoading,
    refetch: userQuery.refetch,

    // Mutations
    suspendUser: suspendUserMutation.mutate,
    isSuspending: suspendUserMutation.isPending,
    activateUser: activateUserMutation.mutate,
    isActivating: activateUserMutation.isPending,
    changeUserRole: changeRoleMutation.mutate,
    isChangingRole: changeRoleMutation.isPending,
    sendEmail: sendEmailMutation.mutate,
    isSendingEmail: sendEmailMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    verifyUser: verifyUserMutation.mutate,
    isVerifying: verifyUserMutation.isPending,
  };
};

// Hook pour les statistiques globales des utilisateurs
export const useAdminUsersStats = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const statsQuery = useQuery({
    queryKey: adminUserKeys.stats(),
    queryFn: () => adminService.getUsersStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation pour exporter les données
  const exportUsersMutation = useMutation({
    mutationFn: (format: 'csv' | 'excel' | 'pdf') => adminService.exportUsers(format),
    onSuccess: (data) => {
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Export réussi",
        description: `Les données ont été exportées au format ${format}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'exporter les données",
        variant: "destructive",
      });
    },
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
    exportUsers: exportUsersMutation.mutate,
    isExporting: exportUsersMutation.isPending,
  };
};
