// hooks/admin/useAdminSettings.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as settingsService from '@/services/admin/settings.service';
import type { 
  GeneralSettings, 
  FeeSettings, 
  TimingSettings, 
  ThresholdSettings, 
  AdminUser,
  ActivityLog,
  EmailTemplate,
  PaginatedResponse
} from '@/app/types/admin';

// ==================== CLÉS DE QUERY ====================

export const settingsKeys = {
  all: ['admin-settings'] as const,
  general: () => [...settingsKeys.all, 'general'] as const,
  fees: () => [...settingsKeys.all, 'fees'] as const,
  timings: () => [...settingsKeys.all, 'timings'] as const,
  thresholds: () => [...settingsKeys.all, 'thresholds'] as const,
  admins: () => [...settingsKeys.all, 'admins'] as const,
  admin: (id: number) => [...settingsKeys.all, 'admin', id] as const,
  logs: (filters?: any) => [...settingsKeys.all, 'logs', filters] as const,
  templates: () => [...settingsKeys.all, 'templates'] as const,
  template: (id: string) => [...settingsKeys.all, 'template', id] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useAdminSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== PARAMÈTRES GÉNÉRAUX ====================

  const generalSettingsQuery = useQuery({
    queryKey: settingsKeys.general(),
    queryFn: () => settingsService.getGeneralSettings(),
    staleTime: 10 * 60 * 1000,
  });

  const updateGeneralSettingsMutation = useMutation({
    mutationFn: (settings: Partial<GeneralSettings>) =>
      settingsService.updateGeneralSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.general() });
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres généraux ont été modifiés",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    },
  });

  // ==================== PARAMÈTRES DES FRAIS ====================

  const feeSettingsQuery = useQuery({
    queryKey: settingsKeys.fees(),
    queryFn: () => settingsService.getFeeSettings(),
    staleTime: 10 * 60 * 1000,
  });

  const updateFeeSettingsMutation = useMutation({
    mutationFn: (settings: Partial<FeeSettings>) =>
      settingsService.updateFeeSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.fees() });
      toast({
        title: "Frais mis à jour",
        description: "Les paramètres des frais ont été modifiés",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour les frais",
        variant: "destructive",
      });
    },
  });

  // ==================== PARAMÈTRES DES DÉLAIS ====================

  const timingSettingsQuery = useQuery({
    queryKey: settingsKeys.timings(),
    queryFn: () => settingsService.getTimingSettings(),
    staleTime: 10 * 60 * 1000,
  });

  const updateTimingSettingsMutation = useMutation({
    mutationFn: (settings: Partial<TimingSettings>) =>
      settingsService.updateTimingSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.timings() });
      toast({
        title: "Délais mis à jour",
        description: "Les paramètres des délais ont été modifiés",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour les délais",
        variant: "destructive",
      });
    },
  });

  // ==================== SEUILS ====================

  const thresholdSettingsQuery = useQuery({
    queryKey: settingsKeys.thresholds(),
    queryFn: () => settingsService.getThresholdSettings(),
    staleTime: 10 * 60 * 1000,
  });

  const updateThresholdSettingsMutation = useMutation({
    mutationFn: (settings: Partial<ThresholdSettings>) =>
      settingsService.updateThresholdSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.thresholds() });
      toast({
        title: "Seuils mis à jour",
        description: "Les paramètres des seuils ont été modifiés",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour les seuils",
        variant: "destructive",
      });
    },
  });

  // ==================== ADMINISTRATEURS ====================

  const adminsQuery = useQuery({
    queryKey: settingsKeys.admins(),
    queryFn: () => settingsService.getAdmins(),
    staleTime: 5 * 60 * 1000,
  });

  const addAdminMutation = useMutation({
    mutationFn: (data: Parameters<typeof settingsService.addAdmin>[0]) =>
      settingsService.addAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.admins() });
      toast({
        title: "Administrateur ajouté",
        description: "Le nouvel administrateur a été créé",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'administrateur",
        variant: "destructive",
      });
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AdminUser> }) =>
      settingsService.updateAdmin(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.admins() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.admin(variables.id) });
      toast({
        title: "Administrateur modifié",
        description: "Les informations ont été mises à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier l'administrateur",
        variant: "destructive",
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id: number) => settingsService.deleteAdmin(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.admins() });
      queryClient.removeQueries({ queryKey: settingsKeys.admin(id) });
      toast({
        title: "Administrateur supprimé",
        description: "L'administrateur a été retiré",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'administrateur",
        variant: "destructive",
      });
    },
  });

  // ==================== LOGS D'ACTIVITÉ ====================

  const getActivityLogs = (filters?: any) => {
    return useQuery({
      queryKey: settingsKeys.logs(filters),
      queryFn: () => settingsService.getActivityLogs(filters),
      staleTime: 2 * 60 * 1000,
    });
  };

  // ==================== MODE MAINTENANCE ====================

  const toggleMaintenanceModeMutation = useMutation({
    mutationFn: (enable: boolean) => settingsService.toggleMaintenanceMode(enable),
    onSuccess: (_, enable) => {
      toast({
        title: enable ? "Mode maintenance activé" : "Mode maintenance désactivé",
        description: enable 
          ? "Le site est maintenant en maintenance"
          : "Le site est de nouveau accessible",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le mode maintenance",
        variant: "destructive",
      });
    },
  });

  // ==================== TEMPLATES D'EMAIL ====================

  const emailTemplatesQuery = useQuery({
    queryKey: settingsKeys.templates(),
    queryFn: () => settingsService.getEmailTemplates(),
    staleTime: 10 * 60 * 1000,
  });

  const getEmailTemplate = (id: string) => {
    return useQuery({
      queryKey: settingsKeys.template(id),
      queryFn: () => settingsService.getEmailTemplateById(id),
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    });
  };

  const updateEmailTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof settingsService.updateEmailTemplate>[1] }) =>
      settingsService.updateEmailTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.templates() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.template(variables.id) });
      toast({
        title: "Template mis à jour",
        description: "Le template d'email a été modifié",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le template",
        variant: "destructive",
      });
    },
  });

  const testEmailTemplateMutation = useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      settingsService.testEmailTemplate(id, email),
    onSuccess: () => {
      toast({
        title: "Email de test envoyé",
        description: "Vérifiez votre boîte de réception",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email de test",
        variant: "destructive",
      });
    },
  });

  // ==================== RETOUR DU HOOK ====================

  return {
    // Paramètres généraux
    generalSettings: generalSettingsQuery.data,
    isLoadingGeneral: generalSettingsQuery.isLoading,
    updateGeneralSettings: updateGeneralSettingsMutation.mutate,
    isUpdatingGeneral: updateGeneralSettingsMutation.isPending,

    // Paramètres des frais
    feeSettings: feeSettingsQuery.data,
    isLoadingFees: feeSettingsQuery.isLoading,
    updateFeeSettings: updateFeeSettingsMutation.mutate,
    isUpdatingFees: updateFeeSettingsMutation.isPending,

    // Paramètres des délais
    timingSettings: timingSettingsQuery.data,
    isLoadingTimings: timingSettingsQuery.isLoading,
    updateTimingSettings: updateTimingSettingsMutation.mutate,
    isUpdatingTimings: updateTimingSettingsMutation.isPending,

    // Seuils
    thresholdSettings: thresholdSettingsQuery.data,
    isLoadingThresholds: thresholdSettingsQuery.isLoading,
    updateThresholdSettings: updateThresholdSettingsMutation.mutate,
    isUpdatingThresholds: updateThresholdSettingsMutation.isPending,

    // Administrateurs
    admins: adminsQuery.data || [],
    isLoadingAdmins: adminsQuery.isLoading,
    addAdmin: addAdminMutation.mutate,
    isAddingAdmin: addAdminMutation.isPending,
    updateAdmin: updateAdminMutation.mutate,
    isUpdatingAdmin: updateAdminMutation.isPending,
    deleteAdmin: deleteAdminMutation.mutate,
    isDeletingAdmin: deleteAdminMutation.isPending,

    // Logs
    getActivityLogs,

    // Mode maintenance
    toggleMaintenanceMode: toggleMaintenanceModeMutation.mutate,
    isTogglingMaintenance: toggleMaintenanceModeMutation.isPending,

    // Templates d'email
    emailTemplates: emailTemplatesQuery.data || [],
    isLoadingTemplates: emailTemplatesQuery.isLoading,
    getEmailTemplate,
    updateEmailTemplate: updateEmailTemplateMutation.mutate,
    isUpdatingTemplate: updateEmailTemplateMutation.isPending,
    testEmailTemplate: testEmailTemplateMutation.mutate,
    isTestingTemplate: testEmailTemplateMutation.isPending,

    // Rafraîchissement
    refetchAll: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  };
};
