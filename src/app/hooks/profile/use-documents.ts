// hooks/kyc/useDocuments.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as userService from '@/app/services/users.service';
import type { 
  DocumentDisplay, 
  KYCStatus, 
  CreateDocumentDto,
  DocumentType 
} from '@/app/types/user';

// ==================== CLÉS DE QUERY ====================

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters?: any) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: number) => [...documentKeys.details(), id] as const,
  kyc: () => [...documentKeys.all, 'kyc'] as const,
  url: (id: number) => [...documentKeys.all, 'url', id] as const,
  progress: () => [...documentKeys.all, 'progress'] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useDocuments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère tous les documents du freelancer
   */
  const documentsQuery = useQuery({
    queryKey: documentKeys.list(),
    queryFn: () => userService.getMyDocuments(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Récupère le statut KYC complet
   */
  const kycStatusQuery = useQuery({
    queryKey: documentKeys.kyc(),
    queryFn: () => userService.getKYCStatus(),
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Récupère l'URL d'un document spécifique
   */
  const getDocumentUrl = (documentId: number) => {
    return useQuery({
      queryKey: documentKeys.url(documentId),
      queryFn: () => userService.getDocumentUrl(documentId),
      enabled: !!documentId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  /**
   * Calcule la progression KYC
   */
  const progressQuery = useQuery({
    queryKey: documentKeys.progress(),
    queryFn: async () => {
      const kycStatus = await userService.getKYCStatus();
      return {
        total: kycStatus.submitted_documents,
        verified: kycStatus.verified_count,
        pending: kycStatus.pending_count,
        rejected: kycStatus.rejected_count,
        percentage: kycStatus.completion_percentage,
      };
    },
    staleTime: 2 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Upload un nouveau document
   */
  const uploadDocumentMutation = useMutation({
    mutationFn: (document: CreateDocumentDto) => userService.uploadDocument(document),
    onSuccess: () => {
      // Invalider toutes les queries liées aux documents
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
      queryClient.invalidateQueries({ queryKey: documentKeys.kyc() });
      queryClient.invalidateQueries({ queryKey: documentKeys.progress() });
      
      toast({
        title: "Document uploadé",
        description: "Votre document a été envoyé pour vérification",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader le document",
        variant: "destructive",
      });
    },
  });

  /**
   * Resoumet un document rejeté
   */
  const resubmitDocumentMutation = useMutation({
    mutationFn: ({ documentId, file }: { documentId: number; file: File }) =>
      userService.resubmitDocument(documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
      queryClient.invalidateQueries({ queryKey: documentKeys.kyc() });
      queryClient.invalidateQueries({ queryKey: documentKeys.progress() });
      
      toast({
        title: "Document resoumis",
        description: "Votre document a été renvoyé pour vérification",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de resoumettre le document",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime un document
   */
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: number) => userService.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
      queryClient.invalidateQueries({ queryKey: documentKeys.kyc() });
      queryClient.invalidateQueries({ queryKey: documentKeys.progress() });
      
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

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Groupe les documents par statut
   */
  const getDocumentsByStatus = () => {
    const documents = documentsQuery.data || [];
    
    return {
      validated: documents.filter(d => d.status === 'validated'),
      pending: documents.filter(d => d.status === 'pending'),
      rejected: documents.filter(d => d.status === 'rejected'),
      inProgress: documents.filter(d => d.status === 'in_progress'),
    };
  };

  /**
   * Vérifie si un type de document est déjà uploadé
   */
  const hasDocumentType = (type: DocumentType) => {
    const documents = documentsQuery.data || [];
    return documents.some(d => d.document_type === type);
  };

  /**
   * Récupère les types de documents manquants
   */
  const getMissingDocumentTypes = (requiredTypes: DocumentType[]) => {
    const documents = documentsQuery.data || [];
    const existingTypes = documents.map(d => d.document_type);
    return requiredTypes.filter(type => !existingTypes.includes(type));
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    error: documentsQuery.error,

    kycStatus: kycStatusQuery.data,
    isLoadingKyc: kycStatusQuery.isLoading,

    progress: progressQuery.data,
    isLoadingProgress: progressQuery.isLoading,

    // URLs
    getDocumentUrl,

    // Utilitaires
    getDocumentsByStatus,
    hasDocumentType,
    getMissingDocumentTypes,

    // Mutations
    uploadDocument: uploadDocumentMutation.mutate,
    isUploading: uploadDocumentMutation.isPending,

    resubmitDocument: resubmitDocumentMutation.mutate,
    isResubmitting: resubmitDocumentMutation.isPending,

    deleteDocument: deleteDocumentMutation.mutate,
    isDeleting: deleteDocumentMutation.isPending,

    // Rafraîchissement
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
      queryClient.invalidateQueries({ queryKey: documentKeys.kyc() });
      queryClient.invalidateQueries({ queryKey: documentKeys.progress() });
    },
  };
};
