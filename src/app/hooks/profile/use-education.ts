// hooks/profile/useEducation.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as userService from '@/app/services/users.service';
import type { Education, CreateEducationDto, UpdateEducationDto } from '@/app/types/user';

// ==================== CLÉS DE QUERY ====================

export const educationKeys = {
  all: ['education'] as const,
  lists: () => [...educationKeys.all, 'list'] as const,
  list: (filters?: any) => [...educationKeys.lists(), filters] as const,
  details: () => [...educationKeys.all, 'detail'] as const,
  detail: (id: number) => [...educationKeys.details(), id] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useEducation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère toutes les formations du freelancer
   */
  const educationQuery = useQuery({
    queryKey: educationKeys.list(),
    queryFn: () => userService.getEducation(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère une formation par son ID
   */
  const getEducationById = (id: number) => {
    return useQuery({
      queryKey: educationKeys.detail(id),
      queryFn: async () => {
        const education = await userService.getEducation();
        return education.find(edu => edu.id === id);
      },
      enabled: !!id,
    });
  };

  // ==================== MUTATIONS ====================

  /**
   * Ajoute une nouvelle formation
   */
  const addEducationMutation = useMutation({
    mutationFn: (data: CreateEducationDto) => userService.addEducation(data),
    onSuccess: (newEducation) => {
      queryClient.invalidateQueries({ queryKey: educationKeys.list() });
      
      toast({
        title: "Formation ajoutée",
        description: "La formation a été ajoutée à votre profil",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la formation",
        variant: "destructive",
      });
    },
  });

  /**
   * Met à jour une formation
   */
  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEducationDto }) =>
      userService.updateEducation(id, data),
    onSuccess: (updatedEducation) => {
      queryClient.invalidateQueries({ queryKey: educationKeys.list() });
      queryClient.setQueryData(educationKeys.detail(updatedEducation.id), updatedEducation);
      
      toast({
        title: "Formation mise à jour",
        description: "La formation a été modifiée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la formation",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime une formation
   */
  const deleteEducationMutation = useMutation({
    mutationFn: (id: number) => userService.deleteEducation(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: educationKeys.list() });
      queryClient.removeQueries({ queryKey: educationKeys.detail(deletedId) });
      
      toast({
        title: "Formation supprimée",
        description: "La formation a été retirée de votre profil",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la formation",
        variant: "destructive",
      });
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Calcule le niveau d'étude le plus élevé
   */
  const getHighestDegree = () => {
    const education = educationQuery.data || [];
    if (education.length === 0) return null;
    
    const degreeLevels: Record<string, number> = {
      'bac': 1,
      'bac+2': 2,
      'bac+3': 3,
      'bac+5': 4,
      'bac+8': 5,
      'doctorat': 6,
    };
    
    return education.reduce((highest: Education | null, current: Education) => {
      const currentLevel = degreeLevels[current.degree || ''] || 0;
      const highestLevel = highest ? degreeLevels[highest.degree || ''] || 0 : 0;
      return currentLevel > highestLevel ? current : highest;
    }, null as Education | null);
  };

  /**
   * Trie les formations par date (plus récentes d'abord)
   */
  const getSortedEducation = () => {
    const education = educationQuery.data || [];
    return [...education].sort((a, b) => 
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  };

  /**
   * Vérifie si une formation est en cours
   */
  const hasCurrentEducation = () => {
    const education = educationQuery.data || [];
    return education.some(edu => edu.is_current);
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    education: educationQuery.data || [],
    isLoading: educationQuery.isLoading,
    error: educationQuery.error,

    // Récupération par ID
    getEducationById,

    // Utilitaires
    getHighestDegree,
    getSortedEducation,
    hasCurrentEducation,

    // Mutations
    addEducation: addEducationMutation.mutate,
    isAdding: addEducationMutation.isPending,

    updateEducation: updateEducationMutation.mutate,
    isUpdating: updateEducationMutation.isPending,

    deleteEducation: deleteEducationMutation.mutate,
    isDeleting: deleteEducationMutation.isPending,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ queryKey: educationKeys.list() }),
  };
};
