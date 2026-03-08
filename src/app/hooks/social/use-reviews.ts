// hooks/reviews/useReviews.ts

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as userService from '@/app/services/users.service';
import type { Review, CreateReviewDto } from '@/app/types';

// ==================== CLÉS DE QUERY ====================

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: any) => [...reviewKeys.lists(), filters] as const,
  freelancer: (freelancerId: number) => [...reviewKeys.all, 'freelancer', freelancerId] as const,
  stats: (freelancerId: number) => [...reviewKeys.all, 'stats', freelancerId] as const,
  helpful: (reviewId: number) => [...reviewKeys.all, 'helpful', reviewId] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useReviews = (freelancerId?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère les évaluations d'un freelancer avec pagination
   */
  const reviewsQuery = useInfiniteQuery({
    queryKey: reviewKeys.freelancer(freelancerId || 0),
    queryFn: ({ pageParam = 1 }) => 
      userService.getFreelancerReviews(freelancerId!, (pageParam - 1) * 10, 10),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!freelancerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Récupère les statistiques des évaluations
   */
  const statsQuery = useQuery({
    queryKey: reviewKeys.stats(freelancerId || 0),
    queryFn: async () => {
      const reviews = await userService.getFreelancerReviews(freelancerId!, 0, 1000);
      
      const total = reviews.length;
      const average = total > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total 
        : 0;
      
      const distribution = {
        1: reviews.filter(r => r.rating === 1).length,
        2: reviews.filter(r => r.rating === 2).length,
        3: reviews.filter(r => r.rating === 3).length,
        4: reviews.filter(r => r.rating === 4).length,
        5: reviews.filter(r => r.rating === 5).length,
      };

      return {
        total,
        average,
        distribution,
        responseRate: reviews.filter(r => r.freelancer_response).length / total * 100 || 0,
      };
    },
    enabled: !!freelancerId,
    staleTime: 5 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Crée une nouvelle évaluation (client)
   */
  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewDto) => userService.createReview(data),
    onSuccess: (newReview) => {
      // Invalider les queries
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.freelancer(newReview.freelancer_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.stats(newReview.freelancer_id) 
      });
      
      toast({
        title: "Évaluation envoyée",
        description: "Merci pour votre retour !",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'évaluation",
        variant: "destructive",
      });
    },
  });

  /**
   * Répond à une évaluation (freelancer)
   */
  const respondToReviewMutation = useMutation({
    mutationFn: ({ reviewId, response }: { reviewId: number; response: string }) =>
      userService.respondToReview(reviewId, response),
    onSuccess: (_, variables) => {
      // Invalider les queries
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.freelancer(freelancerId || 0) 
      });
      
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été publiée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de répondre",
        variant: "destructive",
      });
    },
  });

  /**
   * Marque une évaluation comme utile
   */
  const markHelpfulMutation = useMutation({
    mutationFn: (reviewId: number) => userService.markReviewHelpful(reviewId),
    onSuccess: (_, reviewId) => {
      // Mettre à jour le cache localement
      queryClient.setQueriesData(
        { queryKey: reviewKeys.freelancer(freelancerId || 0) },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: Review[]) =>
              page.map((review: Review) =>
                review.id === reviewId
                  ? { ...review, helpful_count: review.helpful_count + 1 }
                  : review
              )
            ),
          };
        }
      );
      
      toast({
        title: "Merci !",
        description: "Votre vote a été pris en compte",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de voter",
        variant: "destructive",
      });
    },
  });

  /**
   * Signale une évaluation inappropriée
   */
  const flagReviewMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: number; reason: string }) =>
      fetch(`/api/reviews/${reviewId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Évaluation signalée",
        description: "Notre équipe va examiner le contenu",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de signaler",
        variant: "destructive",
      });
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Calcule la moyenne des notes
   */
  const getAverageRating = () => {
    const allReviews = reviewsQuery.data?.pages.flat() || [];
    if (allReviews.length === 0) return 0;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / allReviews.length;
  };

  /**
   * Filtre les évaluations par note
   */
  const filterReviewsByRating = (rating: number) => {
    const allReviews = reviewsQuery.data?.pages.flat() || [];
    return allReviews.filter(r => r.rating === rating);
  };

  /**
   * Vérifie si un client a déjà évalué
   */
  const hasClientReviewed = (clientId: number, serviceId: number) => {
    const allReviews = reviewsQuery.data?.pages.flat() || [];
    return allReviews.some(r => r.client_id === clientId && r.service_id === serviceId);
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    reviews: reviewsQuery.data?.pages.flat() || [],
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error,
    hasMore: reviewsQuery.hasNextPage,
    loadMore: reviewsQuery.fetchNextPage,
    
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    // Utilitaires
    getAverageRating,
    filterReviewsByRating,
    hasClientReviewed,

    // Mutations
    createReview: createReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,

    respondToReview: respondToReviewMutation.mutate,
    isResponding: respondToReviewMutation.isPending,

    markHelpful: markHelpfulMutation.mutate,
    isMarkingHelpful: markHelpfulMutation.isPending,

    flagReview: flagReviewMutation.mutate,
    isFlagging: flagReviewMutation.isPending,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ 
      queryKey: reviewKeys.freelancer(freelancerId || 0) 
    }),
  };
};
