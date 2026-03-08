// hooks/skills/useSkills.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as userService from '@/app/services/users.service';
import type { Skill, FreelancerSkill } from '@/app/types';

// ==================== CLÉS DE QUERY ====================

export const skillKeys = {
  all: ['skills'] as const,
  lists: () => [...skillKeys.all, 'list'] as const,
  list: (filters?: any) => [...skillKeys.lists(), filters] as const,
  mySkills: () => [...skillKeys.all, 'my'] as const,
  search: (query: string) => [...skillKeys.all, 'search', query] as const,
  categories: () => [...skillKeys.all, 'categories'] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useSkills = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère toutes les compétences disponibles
   */
  const allSkillsQuery = useQuery({
    queryKey: skillKeys.list(),
    queryFn: () => userService.getAllSkills(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  /**
   * Récupère les compétences du freelancer connecté
   */
  const mySkillsQuery = useQuery({
    queryKey: skillKeys.mySkills(),
    queryFn: () => userService.getMySkills(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère les catégories de compétences
   */
  const categoriesQuery = useQuery({
    queryKey: skillKeys.categories(),
    queryFn: async () => {
      const skills = await userService.getAllSkills();
      const categories = [...new Set(skills.map(s => s.category).filter(Boolean))];
      return categories;
    },
    staleTime: 30 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Ajoute une compétence au profil
   */
  const addSkillMutation = useMutation({
    mutationFn: ({ skillId, type, proficiency }: { 
      skillId: number; 
      type?: string; 
      proficiency?: number 
    }) => userService.addSkill(skillId, type, proficiency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.mySkills() });
      
      toast({
        title: "Compétence ajoutée",
        description: "La compétence a été ajoutée à votre profil",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la compétence",
        variant: "destructive",
      });
    },
  });

  /**
   * Met à jour une compétence
   */
  const updateSkillMutation = useMutation({
    mutationFn: ({ skillId, type, proficiency }: { 
      skillId: number; 
      type?: string; 
      proficiency?: number 
    }) => userService.updateSkill(skillId, type, proficiency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.mySkills() });
      
      toast({
        title: "Compétence mise à jour",
        description: "La compétence a été modifiée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la compétence",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime une compétence du profil
   */
  const removeSkillMutation = useMutation({
    mutationFn: (skillId: number) => userService.removeSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.mySkills() });
      
      toast({
        title: "Compétence supprimée",
        description: "La compétence a été retirée de votre profil",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    },
  });

  // ==================== RECHERCHE ====================

  /**
   * Recherche des compétences
   */
  const searchSkills = async (query: string) => {
    try {
      const allSkills = await userService.getAllSkills();
      return allSkills.filter(skill => 
        skill.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error: any) {
      toast({
        title: "Erreur de recherche",
        description: error.message || "Impossible de rechercher les compétences",
        variant: "destructive",
      });
      return [];
    }
  };

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Groupe les compétences par type
   */
  const getSkillsByType = () => {
    const skills = mySkillsQuery.data || [];
    
    return {
      primary: skills.filter(s => s.skill_type === 'primary'),
      secondary: skills.filter(s => s.skill_type === 'secondary'),
      other: skills.filter(s => s.skill_type === 'other'),
    };
  };

  /**
   * Vérifie si une compétence est déjà dans le profil
   */
  const hasSkill = (skillId: number) => {
    const skills = mySkillsQuery.data || [];
    return skills.some(s => s.skill_id === skillId);
  };

  /**
   * Récupère les compétences non ajoutées
   */
  const getAvailableSkills = () => {
    const allSkills = allSkillsQuery.data || [];
    const mySkills = mySkillsQuery.data || [];
    const mySkillIds = mySkills.map(s => s.skill_id);
    return allSkills.filter(skill => !mySkillIds.includes(skill.id));
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    allSkills: allSkillsQuery.data || [],
    mySkills: mySkillsQuery.data || [],
    categories: categoriesQuery.data || [],
    isLoading: allSkillsQuery.isLoading || mySkillsQuery.isLoading,
    error: allSkillsQuery.error || mySkillsQuery.error,

    // Utilitaires
    getSkillsByType,
    hasSkill,
    getAvailableSkills,
    searchSkills,

    // Mutations
    addSkill: addSkillMutation.mutate,
    isAdding: addSkillMutation.isPending,

    updateSkill: updateSkillMutation.mutate,
    isUpdating: updateSkillMutation.isPending,

    removeSkill: removeSkillMutation.mutate,
    isRemoving: removeSkillMutation.isPending,

    // Rafraîchissement
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.mySkills() });
    },
  };
};
