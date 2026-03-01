// hooks/favorites/useWishlist.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as serviceService from '@/services/service.service';
import type { WishlistItem } from '@/app/types/services';

// ==================== CLÉS DE QUERY ====================

export const wishlistKeys = {
  all: ['wishlist'] as const,
  items: () => [...wishlistKeys.all, 'items'] as const,
  check: (serviceId: number) => [...wishlistKeys.all, 'check', serviceId] as const,
  count: () => [...wishlistKeys.all, 'count'] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère la wishlist de l'utilisateur
   */
  const wishlistQuery = useQuery({
    queryKey: wishlistKeys.items(),
    queryFn: () => serviceService.getWishlist(),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère le nombre d'éléments dans la wishlist
   */
  const countQuery = useQuery({
    queryKey: wishlistKeys.count(),
    queryFn: async () => {
      const wishlist = await serviceService.getWishlist();
      return wishlist.items.length;
    },
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Vérifie si un service est dans la wishlist
   */
  const useIsInWishlist = (serviceId: number) => {
    return useQuery({
      queryKey: wishlistKeys.check(serviceId),
      queryFn: async () => {
        const wishlist = await serviceService.getWishlist();
        return wishlist.items.some(item => item.serviceId === serviceId);
      },
      enabled: !!serviceId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== MUTATIONS ====================

  /**
   * Ajoute un service aux favoris
   */
  const addToWishlistMutation = useMutation({
    mutationFn: (serviceId: number) => serviceService.addToWishlist(serviceId),
    onSuccess: (_, serviceId) => {
      // Invalider les queries
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.check(serviceId) });
      
      toast({
        title: "Ajouté aux favoris",
        description: "Le service a été ajouté à votre liste",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter aux favoris",
        variant: "destructive",
      });
    },
  });

  /**
   * Retire un service des favoris
   */
  const removeFromWishlistMutation = useMutation({
    mutationFn: (serviceId: number) => serviceService.removeFromWishlist(serviceId),
    onSuccess: (_, serviceId) => {
      // Invalider les queries
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.check(serviceId) });
      
      toast({
        title: "Retiré des favoris",
        description: "Le service a été retiré de votre liste",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer des favoris",
        variant: "destructive",
      });
    },
  });

  /**
   * Vide la wishlist
   */
  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      const wishlist = await serviceService.getWishlist();
      await Promise.all(
        wishlist.items.map(item => serviceService.removeFromWishlist(item.serviceId))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
      
      toast({
        title: "Liste vidée",
        description: "Tous les favoris ont été supprimés",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de vider la liste",
        variant: "destructive",
      });
    },
  });

  /**
   * Toggle un favori (ajoute ou retire)
   */
  const toggleWishlist = async (serviceId: number, isCurrentlyInWishlist: boolean) => {
    if (isCurrentlyInWishlist) {
      await removeFromWishlistMutation.mutateAsync(serviceId);
    } else {
      await addToWishlistMutation.mutateAsync(serviceId);
    }
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    wishlist: wishlistQuery.data?.items || [],
    total: wishlistQuery.data?.total || 0,
    isLoading: wishlistQuery.isLoading,
    error: wishlistQuery.error,
    count: countQuery.data || 0,

    // Vérification
    useIsInWishlist,
    isInWishlist: async (serviceId: number) => {
      const wishlist = await serviceService.getWishlist();
      return wishlist.items.some(item => item.serviceId === serviceId);
    },

    // Mutations
    addToWishlist: addToWishlistMutation.mutate,
    isAdding: addToWishlistMutation.isPending,

    removeFromWishlist: removeFromWishlistMutation.mutate,
    isRemoving: removeFromWishlistMutation.isPending,

    clearWishlist: clearWishlistMutation.mutate,
    isClearing: clearWishlistMutation.isPending,

    toggleWishlist,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.items() }),
  };
};
