// hooks/missions/use-missions.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/components/ui/use-toast";
import * as missionService from "@/app/services/mission.service";
import type {
  MissionFiltersFormData,
  CreateMissionFormData,
  UpdateMissionFormData,
  CancelMissionFormData,
  AssignProviderFormData,
  UpdateMissionStatusFormData,
  MissionAttachmentFormData,
} from "@/app/lib/validators/mission.validator";
import type { GetDataResponse, PaginatedResponse, Mission, MissionDetail, } from "@/app/types";

// ==================== QUERY KEYS ====================

export const missionKeys = {
  all: ["missions"] as const,
  lists: () => [...missionKeys.all, "list"] as const,
  list: (filters?: MissionFiltersFormData) => [...missionKeys.lists(), filters] as const,
  details: () => [...missionKeys.all, "detail"] as const,
  detail: (id: string) => [...missionKeys.details(), id] as const,
  stats: () => [...missionKeys.all, "stats"] as const,
  dashboard: () => [...missionKeys.all, "dashboard"] as const,
  userMissions: (userId: string) => [...missionKeys.all, "user", userId] as const,
  attachments: (missionId: string) => [...missionKeys.detail(missionId), "attachments"] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useMissions = (filters?: MissionFiltersFormData) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupérer la liste des missions
   */
  const missionsQuery = useQuery({
    queryKey: missionKeys.list(filters),
    queryFn: () => missionService.searchMissions(filters),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupérer les statistiques du dashboard
   */
  const dashboardQuery = useQuery({
    queryKey: missionKeys.dashboard(),
    queryFn: () => missionService.getMissionDashboard(),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupérer les statistiques des missions du client
   */
  const statsQuery = useQuery({
    queryKey: missionKeys.stats(),
    queryFn: () => missionService.getMissionStats(),
    staleTime: 5 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Créer une mission
   */
  const createMissionMutation = useMutation({
    mutationFn: (data: CreateMissionFormData) => missionService.createMission(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: missionKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: missionKeys.stats() });
      
      toast({
        title: "Mission créée",
        description: response.message || "La mission a été créée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la mission",
        variant: "destructive",
      });
    },
  });

  /**
   * Mettre à jour une mission
   */
  const updateMissionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMissionFormData }) =>
      missionService.updateMission(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: missionKeys.dashboard() });
      
      toast({
        title: "Mission mise à jour",
        description: response.message || "La mission a été mise à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la mission",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprimer une mission
   */
  const deleteMissionMutation = useMutation({
    mutationFn: (id: string) => missionService.deleteMission(id),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: missionKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: missionKeys.stats() });
      
      toast({
        title: "Mission supprimée",
        description: response.message || "La mission a été supprimée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la mission",
        variant: "destructive",
      });
    },
  });

  /**
   * Ajouter une pièce jointe
   */
  const addAttachmentMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      missionService.addMissionAttachment(id, file),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.attachments(variables.id) });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables.id) });
      
      toast({
        title: "Pièce jointe ajoutée",
        description: response.message || "La pièce jointe a été ajoutée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la pièce jointe",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprimer une pièce jointe
   */
  const deleteAttachmentMutation = useMutation({
    mutationFn: ({ missionId, attachmentId }: { missionId: string; attachmentId: string }) =>
      missionService.deleteMissionAttachment(missionId, attachmentId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.attachments(variables.missionId) });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables.missionId) });
      
      toast({
        title: "Pièce jointe supprimée",
        description: response.message || "La pièce jointe a été supprimée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la pièce jointe",
        variant: "destructive",
      });
    },
  });

  /**
   * Annuler une mission
   */
  const cancelMissionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelMissionFormData }) =>
      missionService.updateMissionStatus(id, 'cancelled', data.reason),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: missionKeys.dashboard() });
      
      toast({
        title: "Mission annulée",
        description: response.message || "La mission a été annulée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la mission",
        variant: "destructive",
      });
    },
  });

  /**
   * Mettre à jour le statut d'une mission (admin)
   */
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMissionStatusFormData }) =>
      missionService.updateMissionStatus(id, data.status, data.reason),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: missionKeys.dashboard() });
      
      toast({
        title: "Statut mis à jour",
        description: response.message || "Le statut de la mission a été mis à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  return {
    // Données
    missions: missionsQuery.data?.items || [],
    //meta: missionsQuery.data?.meta || null,
    pagination: missionsQuery ? {
      page: missionsQuery.data?.page,
      total: missionsQuery.data?.total,
      total_pages: missionsQuery.data?.total_pages,
      per_page: missionsQuery.data?.per_page,
    } : null,
    isLoading: missionsQuery.isLoading,
    isError: missionsQuery.isError,
    error: missionsQuery.error,
    refetch: missionsQuery.refetch,

    // Dashboard
    dashboard: dashboardQuery.data?.data || null,
    dashboardLoading: dashboardQuery.isLoading,

    // Stats
    stats: statsQuery.data?.data || null,
    statsLoading: statsQuery.isLoading,

    // Mutations
    createMission: createMissionMutation.mutate,
    isCreating: createMissionMutation.isPending,
    createError: createMissionMutation.error,

    updateMission: updateMissionMutation.mutate,
    isUpdating: updateMissionMutation.isPending,
    updateError: updateMissionMutation.error,

    deleteMission: deleteMissionMutation.mutate,
    isDeleting: deleteMissionMutation.isPending,
    deleteError: deleteMissionMutation.error,

    addAttachment: addAttachmentMutation.mutate,
    isAddingAttachment: addAttachmentMutation.isPending,
    addAttachmentError: addAttachmentMutation.error,

    deleteAttachment: deleteAttachmentMutation.mutate,
    isDeletingAttachment: deleteAttachmentMutation.isPending,
    deleteAttachmentError: deleteAttachmentMutation.error,

    cancelMission: cancelMissionMutation.mutate,
    isCancelling: cancelMissionMutation.isPending,
    cancelError: cancelMissionMutation.error,

    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    updateStatusError: updateStatusMutation.error,
  };
};

// ==================== HOOK POUR UNE MISSION SPÉCIFIQUE ====================

export const useMission = (missionId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Récupérer les détails d'une mission
   */
  const missionQuery = useQuery({
    queryKey: missionKeys.detail(missionId),
    queryFn: () => missionService.getMissionDetails(missionId),
    enabled: !!missionId,
    staleTime: 5 * 60 * 1000,
  });


  return {
    mission: missionQuery.data?.data || null,
    isError: missionQuery.isError,
    error: missionQuery.error,
    refetch: () => {
      missionQuery.refetch();
    },
  };
};

// ==================== HOOK POUR LES MISSIONS D'UN UTILISATEUR ====================

export const useUserMissions = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const userMissionsQuery = useQuery({
    queryKey: missionKeys.userMissions(userId),
    queryFn: () => missionService.getUserMissions(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    missions: userMissionsQuery.data?.data || [],
    isLoading: userMissionsQuery.isLoading,
    isError: userMissionsQuery.isError,
    error: userMissionsQuery.error,
    refetch: userMissionsQuery.refetch,
  };
};

// ==================== HOOK ADMIN ====================

export const useAdminMissions = (filters?: MissionFiltersFormData & { include_deleted?: boolean }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const adminMissionsQuery = useQuery({
    queryKey: [...missionKeys.lists(), "admin", filters],
    queryFn: () => missionService.getAdminMissions(filters),
    staleTime: 5 * 60 * 1000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMissionStatusFormData }) =>
      missionService.updateMissionStatus(id, data.status, data.reason),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables.id) });
      
      toast({
        title: "Statut mis à jour",
        description: response.message || "Le statut de la mission a été mis à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  const deleteMissionMutation = useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      missionService.adminDeleteMission(id, permanent),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(variables.id) });
      
      toast({
        title: "Mission supprimée",
        description: response.message || "La mission a été supprimée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la mission",
        variant: "destructive",
      });
    },
  });

  return {
    missions: adminMissionsQuery.data?.items || [],
    //meta: adminMissionsQuery.data?.meta || null,
    pagination: adminMissionsQuery ? {
      page: adminMissionsQuery.data?.page,
      total: adminMissionsQuery.data?.total,
      total_pages: adminMissionsQuery.data?.total_pages,
      per_page: adminMissionsQuery.data?.per_page,
    } : null,
    isLoading: adminMissionsQuery.isLoading,
    isError: adminMissionsQuery.isError,
    error: adminMissionsQuery.error,
    refetch: adminMissionsQuery.refetch,

    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,

    deleteMission: deleteMissionMutation.mutate,
    isDeleting: deleteMissionMutation.isPending,
  };
};

// ==================== HOOK POUR LES STATISTIQUES ADMIN ====================

export const useAdminMissionStats = () => {
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: [...missionKeys.all, "admin", "stats"],
    queryFn: () => missionService.getMissionStats(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    stats: statsQuery.data?.data || null,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
};

// ==================== HOOK POUR LE DASHBOARD ADMIN ====================

export const useAdminDashboard = () => {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: missionKeys.dashboard(),
    queryFn: () => missionService.getMissionDashboard(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    dashboard: dashboardQuery.data || null,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
  };
};
