// hooks/profile/useExperiences.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as userService from '@/services/user.service';
import type { ProfessionalExperience, CreateExperienceDto, UpdateExperienceDto } from '@/app/types/user';

// ==================== CLÉS DE QUERY ====================

export const experienceKeys = {
  all: ['experiences'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (filters?: any) => [...experienceKeys.lists(), filters] as const,
  details: () => [...experienceKeys.all, 'detail'] as const,
  detail: (id: number) => [...experienceKeys.details(), id] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useExperiences = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère toutes les expériences du freelancer
   */
  const experiencesQuery = useQuery({
    queryKey: experienceKeys.list(),
    queryFn: () => userService.getExperiences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère une expérience par son ID
   */
  const getExperienceById = (id: number) => {
    return useQuery({
      queryKey: experienceKeys.detail(id),
      queryFn: async () => {
        const experiences = await userService.getExperiences();
        return experiences.find(exp => exp.id === id);
      },
      enabled: !!id,
    });
  };

  // ==================== MUTATIONS ====================

  /**
   * Ajoute une nouvelle expérience
   */
  const addExperienceMutation = useMutation({
    mutationFn: (data: CreateExperienceDto) => userService.addExperience(data),
    onSuccess: (newExperience) => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
      
      toast({
        title: "Expérience ajoutée",
        description: "L'expérience a été ajoutée à votre profil",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'expérience",
        variant: "destructive",
      });
    },
  });

  /**
   * Met à jour une expérience
   */
  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExperienceDto }) =>
      userService.updateExperience(id, data),
    onSuccess: (updatedExperience) => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
      queryClient.setQueryData(experienceKeys.detail(updatedExperience.id), updatedExperience);
      
      toast({
        title: "Expérience mise à jour",
        description: "L'expérience a été modifiée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour l'expérience",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime une expérience
   */
  const deleteExperienceMutation = useMutation({
    mutationFn: (id: number) => userService.deleteExperience(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
      queryClient.removeQueries({ queryKey: experienceKeys.detail(deletedId) });
      
      toast({
        title: "Expérience supprimée",
        description: "L'expérience a été retirée de votre profil",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'expérience",
        variant: "destructive",
      });
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Calcule la durée totale d'expérience
   */
  const getTotalExperienceDuration = () => {
    const experiences = experiencesQuery.data || [];
    let totalMonths = 0;
    
    experiences.forEach(exp => {
      const start = new Date(exp.start_date);
      const end = exp.is_current ? new Date() : new Date(exp.end_date!);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth());
      totalMonths += months;
    });
    
    return {
      months: totalMonths,
      years: Math.floor(totalMonths / 12),
      remainingMonths: totalMonths % 12,
    };
  };

  /**
   * Trie les expériences par date (plus récentes d'abord)
   */
  const getSortedExperiences = () => {
    const experiences = experiencesQuery.data || [];
    return [...experiences].sort((a, b) => 
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    experiences: experiencesQuery.data || [],
    isLoading: experiencesQuery.isLoading,
    error: experiencesQuery.error,

    // Récupération par ID
    getExperienceById,

    // Utilitaires
    getTotalExperienceDuration,
    getSortedExperiences,

    // Mutations
    addExperience: addExperienceMutation.mutate,
    isAdding: addExperienceMutation.isPending,

    updateExperience: updateExperienceMutation.mutate,
    isUpdating: updateExperienceMutation.isPending,

    deleteExperience: deleteExperienceMutation.mutate,
    isDeleting: deleteExperienceMutation.isPending,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ queryKey: experienceKeys.list() }),
  };
};
