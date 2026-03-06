// hooks/freelancer/useFreelancer.ts

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as userService from '@/app/services/users.service';
import type { 
  FreelancerFullProfile,
  UpdateFreelancerProfileData,
  UpdateFreelancerProfileDto,
  FreelancerSkill,
  ProfessionalExperience,
  Education,
  DocumentDisplay,
  KYCStatus,
  FreelancerProfileUpdate
} from '@/app/types/user';

// ==================== CLÉS DE QUERY ====================

export const freelancerKeys = {
  all: ['freelancers'] as const,
  profile: (freelancerId?: number) => [...freelancerKeys.all, 'profile', freelancerId] as const,
  publicProfile: (freelancerId: number) => [...freelancerKeys.all, 'public', freelancerId] as const,
  search: (filters: any) => [...freelancerKeys.all, 'search', filters] as const,
  skills: (freelancerId: number) => [...freelancerKeys.all, 'skills', freelancerId] as const,
  experiences: (freelancerId: number) => [...freelancerKeys.all, 'experiences', freelancerId] as const,
  education: (freelancerId: number) => [...freelancerKeys.all, 'education', freelancerId] as const,
  documents: (freelancerId: number) => [...freelancerKeys.all, 'documents', freelancerId] as const,
  kyc: (freelancerId: number) => [...freelancerKeys.all, 'kyc', freelancerId] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useFreelancer = (freelancerId?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère le profil complet du freelancer (pour le freelancer lui-même)
   */
  const myProfileQuery = useQuery({
    queryKey: freelancerKeys.profile(freelancerId),
    queryFn: () => userService.getMyFreelancerProfile(),
    enabled: !freelancerId, // Si pas de freelancerId, c'est le profil de l'utilisateur connecté
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère le profil public d'un freelancer (pour les clients)
   */
  const publicProfileQuery = useQuery({
    queryKey: freelancerKeys.publicProfile(freelancerId!),
    queryFn: () => userService.getFreelancerPublicProfile(freelancerId!),
    enabled: !!freelancerId,
    staleTime: 5 * 60 * 1000,
  });

  // ==================== MUTATIONS PROFIL ====================

  /**
   * Mettre à jour le profil freelancer
   */
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateFreelancerProfileData) =>
      userService.updateMyFreelancerProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ 
        queryKey: freelancerKeys.profile(updatedProfile.userId) 
      });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations professionnelles ont été modifiées avec succès",
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
  const updateProfileFields = (fields: FreelancerProfileUpdate) => {
    const currentProfile = freelancerId ? publicProfileQuery.data : myProfileQuery.data;
    if (!currentProfile) return;

    updateProfileMutation.mutate({
      ...currentProfile,
      ...fields,
    });
  };

  /**
   * Mettre à jour la disponibilité du freelancer
   */
  const toggleAvailability = () => {
    const currentProfile = freelancerId ? publicProfileQuery.data : myProfileQuery.data;
    if (!currentProfile) return;

    updateProfileMutation.mutate({
      is_available: !currentProfile.is_available
    });
  };

  /**
   * Mettre à jour le tarif horaire
   */
  const updateHourlyRate = (hourlyRate: number) => {
    updateProfileMutation.mutate({ hourly_rate: hourlyRate });
  };

  // ==================== COMPÉTENCES ====================

  /**
   * Récupère les compétences du freelancer
   */
  const skillsQuery = useQuery({
    queryKey: freelancerKeys.skills(freelancerId || 0),
    queryFn: () => userService.getMySkills(),
    enabled: !freelancerId, // Seulement pour le profil connecté
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Ajouter une compétence
   */
  const addSkillMutation = useMutation({
    mutationFn: ({ skillId, type, proficiency }: { 
      skillId: number; 
      type?: string; 
      proficiency?: number 
    }) => userService.addSkill(skillId, type, proficiency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.skills(freelancerId || 0) });
      
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
   * Supprimer une compétence
   */
  const removeSkillMutation = useMutation({
    mutationFn: (skillId: number) => userService.removeSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.skills(freelancerId || 0) });
      
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

  /**
   * Mettre à jour une compétence
   */
  const updateSkillMutation = useMutation({
    mutationFn: ({ skillId, type, proficiency }: { 
      skillId: number; 
      type?: string; 
      proficiency?: number 
    }) => userService.updateSkill(skillId, type, proficiency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.skills(freelancerId || 0) });
      
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

  // ==================== EXPÉRIENCES ====================

  /**
   * Récupère les expériences du freelancer
   */
  const experiencesQuery = useQuery({
    queryKey: freelancerKeys.experiences(freelancerId || 0),
    queryFn: () => userService.getExperiences(),
    enabled: !freelancerId,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Ajouter une expérience
   */
  const addExperienceMutation = useMutation({
    mutationFn: (data: any) => userService.addExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.experiences(freelancerId || 0) });
      
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
   * Modifier une expérience
   */
  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      userService.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.experiences(freelancerId || 0) });
      
      toast({
        title: "Expérience modifiée",
        description: "L'expérience a été mise à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier l'expérience",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprimer une expérience
   */
  const deleteExperienceMutation = useMutation({
    mutationFn: (id: number) => userService.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.experiences(freelancerId || 0) });
      
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

  // ==================== FORMATIONS ====================

  /**
   * Récupère les formations du freelancer
   */
  const educationQuery = useQuery({
    queryKey: freelancerKeys.education(freelancerId || 0),
    queryFn: () => userService.getEducation(),
    enabled: !freelancerId,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Ajouter une formation
   */
  const addEducationMutation = useMutation({
    mutationFn: (data: any) => userService.addEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.education(freelancerId || 0) });
      
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
   * Modifier une formation
   */
  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      userService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.education(freelancerId || 0) });
      
      toast({
        title: "Formation modifiée",
        description: "La formation a été mise à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier la formation",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprimer une formation
   */
  const deleteEducationMutation = useMutation({
    mutationFn: (id: number) => userService.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.education(freelancerId || 0) });
      
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

  // ==================== DOCUMENTS KYC ====================

  /**
   * Récupère les documents KYC
   */
  const documentsQuery = useQuery({
    queryKey: freelancerKeys.documents(freelancerId || 0),
    queryFn: () => userService.getMyDocuments(),
    enabled: !freelancerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Récupère le statut KYC
   */
  const kycStatusQuery = useQuery({
    queryKey: freelancerKeys.kyc(freelancerId || 0),
    queryFn: () => userService.getKYCStatus(),
    enabled: !freelancerId,
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Uploader un document
   */
  const uploadDocumentMutation = useMutation({
    mutationFn: (document: any) => userService.uploadDocument(document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.documents(freelancerId || 0) });
      queryClient.invalidateQueries({ queryKey: freelancerKeys.kyc(freelancerId || 0) });
      
      toast({
        title: "Document uploadé",
        description: "Votre document a été envoyé pour vérification",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'uploader le document",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprimer un document
   */
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: number) => userService.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerKeys.documents(freelancerId || 0) });
      queryClient.invalidateQueries({ queryKey: freelancerKeys.kyc(freelancerId || 0) });
      
      toast({
        title: "Document supprimé",
        description: "Le document a été retiré",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le document",
        variant: "destructive",
      });
    },
  });

  // ==================== RETOUR DU HOOK ====================

  const profile = freelancerId ? publicProfileQuery.data : myProfileQuery.data;
  const isLoading = freelancerId ? publicProfileQuery.isLoading : myProfileQuery.isLoading;
  const error = freelancerId ? publicProfileQuery.error : myProfileQuery.error;

  return {
    // Profil
    profile,
    isLoading,
    error,
    isOwnProfile: !freelancerId,

    // Mutations profil
    updateProfile: updateProfileMutation.mutate,
    updateProfileFields,
    toggleAvailability,
    updateHourlyRate,
    isUpdating: updateProfileMutation.isPending,

    // Compétences
    skills: skillsQuery.data || [],
    isLoadingSkills: skillsQuery.isLoading,
    addSkill: addSkillMutation.mutate,
    removeSkill: removeSkillMutation.mutate,
    updateSkill: updateSkillMutation.mutate,
    isAddingSkill: addSkillMutation.isPending,
    isRemovingSkill: removeSkillMutation.isPending,

    // Expériences
    experiences: experiencesQuery.data || [],
    isLoadingExperiences: experiencesQuery.isLoading,
    addExperience: addExperienceMutation.mutate,
    updateExperience: updateExperienceMutation.mutate,
    deleteExperience: deleteExperienceMutation.mutate,
    isAddingExperience: addExperienceMutation.isPending,
    isUpdatingExperience: updateExperienceMutation.isPending,

    // Formations
    education: educationQuery.data || [],
    isLoadingEducation: educationQuery.isLoading,
    addEducation: addEducationMutation.mutate,
    updateEducation: updateEducationMutation.mutate,
    deleteEducation: deleteEducationMutation.mutate,
    isAddingEducation: addEducationMutation.isPending,
    isUpdatingEducation: updateEducationMutation.isPending,

    // Documents KYC
    documents: documentsQuery.data || [],
    isLoadingDocuments: documentsQuery.isLoading,
    kycStatus: kycStatusQuery.data,
    isLoadingKyc: kycStatusQuery.isLoading,
    uploadDocument: uploadDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    isUploading: uploadDocumentMutation.isPending,

    // Rafraîchissement
    refetchProfile: () => {
      if (freelancerId) {
        queryClient.invalidateQueries({ queryKey: freelancerKeys.publicProfile(freelancerId) });
      } else {
        queryClient.invalidateQueries({ queryKey: freelancerKeys.profile() });
      }
    },
    refetchSkills: () => queryClient.invalidateQueries({ 
      queryKey: freelancerKeys.skills(freelancerId || 0) 
    }),
    refetchExperiences: () => queryClient.invalidateQueries({ 
      queryKey: freelancerKeys.experiences(freelancerId || 0) 
    }),
    refetchEducation: () => queryClient.invalidateQueries({ 
      queryKey: freelancerKeys.education(freelancerId || 0) 
    }),
    refetchDocuments: () => queryClient.invalidateQueries({ 
      queryKey: freelancerKeys.documents(freelancerId || 0) 
    }),
  };
};

// ==================== HOOK DE RECHERCHE ====================

export const useFreelancerSearch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Recherche de freelancers avec pagination infinie
   */
  const infiniteSearchQuery = useInfiniteQuery({
    queryKey: freelancerKeys.search({}),
    queryFn: ({ pageParam = 1 }) => 
      userService.searchFreelancers({ 
        skip: (pageParam - 1) * 10, 
        limit: 10 
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: false, // Désactivé par défaut
  });

  /**
   * Rechercher des freelancers avec filtres
   */
  const search = async (filters: Parameters<typeof userService.searchFreelancers>[0]) => {
    try {
      const results = await userService.searchFreelancers(filters);
      
      // Mettre en cache les résultats
      queryClient.setQueryData(freelancerKeys.search(filters), results);
      
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
    results: infiniteSearchQuery.data?.pages.flat() || [],
    isLoading: infiniteSearchQuery.isFetching,
    hasMore: infiniteSearchQuery.hasNextPage,
    loadMore: infiniteSearchQuery.fetchNextPage,
    refetch: infiniteSearchQuery.refetch,
  };
};

// ==================== HOOKS SPÉCIALISÉS ====================

/**
 * Hook pour gérer les compétences d'un freelancer
 */
export const useFreelancerSkills = (freelancerId?: number) => {
  const { 
    skills, 
    isLoadingSkills, 
    addSkill, 
    removeSkill, 
    updateSkill,
    isAddingSkill,
    isRemovingSkill 
  } = useFreelancer(freelancerId);

  return {
    skills,
    isLoading: isLoadingSkills,
    addSkill,
    removeSkill,
    updateSkill,
    isAdding: isAddingSkill,
    isRemoving: isRemovingSkill,
  };
};

/**
 * Hook pour gérer les expériences d'un freelancer
 */
export const useFreelancerExperiences = (freelancerId?: number) => {
  const { 
    experiences, 
    isLoadingExperiences, 
    addExperience, 
    updateExperience, 
    deleteExperience,
    isAddingExperience,
    isUpdatingExperience 
  } = useFreelancer(freelancerId);

  return {
    experiences,
    isLoading: isLoadingExperiences,
    addExperience,
    updateExperience,
    deleteExperience,
    isAdding: isAddingExperience,
    isUpdating: isUpdatingExperience,
  };
};

/**
 * Hook pour gérer les formations d'un freelancer
 */
export const useFreelancerEducation = (freelancerId?: number) => {
  const { 
    education, 
    isLoadingEducation, 
    addEducation, 
    updateEducation, 
    deleteEducation,
    isAddingEducation,
    isUpdatingEducation 
  } = useFreelancer(freelancerId);

  return {
    education,
    isLoading: isLoadingEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    isAdding: isAddingEducation,
    isUpdating: isUpdatingEducation,
  };
};

/**
 * Hook pour gérer les documents KYC d'un freelancer
 */
export const useFreelancerKYC = (freelancerId?: number) => {
  const { 
    documents, 
    kycStatus, 
    isLoadingDocuments, 
    isLoadingKyc, 
    uploadDocument, 
    deleteDocument,
    isUploading 
  } = useFreelancer(freelancerId);

  return {
    documents,
    kycStatus,
    isLoading: isLoadingDocuments || isLoadingKyc,
    uploadDocument,
    deleteDocument,
    isUploading,
    progress: kycStatus?.completion_percentage || 0,
    verifiedCount: kycStatus?.verified_count || 0,
    pendingCount: kycStatus?.pending_count || 0,
  };
};
