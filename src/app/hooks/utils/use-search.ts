// hooks/search/useSearch.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import { useState, useEffect, useCallback } from 'react';
import * as serviceService from '@/app/services/service.service';
import * as userService from '@/app/services/users.service';
import * as messageService from '@/app/services/chat.service';
import type { PaginatedResponse, Service } from '@/app/types/services';
import type { FreelancerFullProfile } from '@/app/types/user';
import type { Message } from '@/app/types/admin';

// ==================== TYPES ====================

export interface SearchResult {
  id: string;
  type: 'service' | 'freelancer' | 'message' | 'user';
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
  score?: number;
  data: any;
}

export interface SearchFilters {
  type?: ('service' | 'freelancer' | 'message')[];
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
}

export interface RecentSearch {
  id: string;
  query: string;
  type?: string;
  timestamp: number;
}

// ==================== CLÉS DE QUERY ====================

export const searchKeys = {
  all: ['search'] as const,
  results: (query: string, filters?: SearchFilters) => 
    [...searchKeys.all, 'results', query, filters] as const,
  suggestions: (query: string) => [...searchKeys.all, 'suggestions', query] as const,
  recent: () => [...searchKeys.all, 'recent'] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useSearch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchHistory, setSearchHistory] = useState<RecentSearch[]>([]);

  // ==================== CHARGEMENT DE L'HISTORIQUE ====================

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur chargement historique:', e);
      }
    }
  }, []);

  // ==================== FONCTIONS DE RECHERCHE ====================

  /**
   * Recherche globale dans tous les types
   */
  const searchAll = useCallback(async (
    query: string,
    filters?: SearchFilters
  ): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return [];

    try {
      const results: SearchResult[] = [];

      // Recherche de services
      if (!filters?.type || filters.type.includes('service')) {
          const services:PaginatedResponse<Service> = await serviceService.searchServices({ search: query });
          results.push(...services.services.map((s: Service) => ({
            id: `service-${s.id}`,
            type: 'service' as const, // Add 'as const' to fix the type
            title: s.title,
            subtitle: s.short_description,
            service_images: s.service_images?.[0],
            url: `/services/${s.id}`,
            data: s,
          })));
        }

      // Recherche de freelancers
      if (!filters?.type || filters.type.includes('freelancer')) {
        const freelancers = await userService.searchFreelancers({ 
          skill: query,
          ...filters 
        });
        results.push(...freelancers.map((f: FreelancerFullProfile) => ({
          id: `freelancer-${f.userId}`,
          type: 'freelancer' as const,
          title: f.user?.username || 'Freelancer',
          subtitle: f.primary_skill,
          image: f.user?.profile_picture,
          url: `/freelancer/${f.userId}`,
          data: f,
        })));
      }

      // Recherche de messages
      if (!filters?.type || filters.type.includes('message')) {
        try {
          const messages = await messageService.searchMessages(query);
          results.push(...messages.map((m: Message) => ({
            id: `message-${m.id}`,
            type: 'message' as const,
            title: `Message dans conversation #${m.conversation_id}`,
            subtitle: m.content?.substring(0, 100),
            url: `/chat/${m.conversation_id}`,
            data: m,
          })));
        } catch (e) {
          // Ignorer les erreurs de recherche de messages
        }
      }

      // Sauvegarder la recherche
      saveRecentSearch(query);

      return results;
    } catch (error) {
      console.error('Erreur recherche globale:', error);
      return [];
    }
  }, []);

  /**
   * Recherche de services uniquement
   */
  const searchServices = useCallback(async (
    query: string,
    filters?: Omit<SearchFilters, 'type'>
  ): Promise<Service[]> => {
    try {
      const result = await serviceService.searchServices({ 
        search: query,
        ...filters 
      });
      return result.services;
    } catch (error) {
      console.error('Erreur recherche services:', error);
      return [];
    }
  }, []);

  /**
   * Recherche de freelancers uniquement
   */
  const searchFreelancers = useCallback(async (
    query: string,
    filters?: Omit<SearchFilters, 'type'>
  ): Promise<FreelancerFullProfile[]> => {
    try {
      return await userService.searchFreelancers({ 
        skill: query,
        ...filters 
      });
    } catch (error) {
      console.error('Erreur recherche freelancers:', error);
      return [];
    }
  }, []);

  /**
   * Recherche de messages uniquement
   */
  const searchMessages = useCallback(async (
    query: string,
    conversationId?: number
  ): Promise<Message[]> => {
    try {
      return await messageService.searchMessages(query, 
        conversationId ? { conversation_id: conversationId } : undefined
      );
    } catch (error) {
      console.error('Erreur recherche messages:', error);
      return [];
    }
  }, []);

  /**
   * Récupère des suggestions de recherche
   */
  const getSearchSuggestions = useCallback(async (
    query: string
  ): Promise<string[]> => {
    if (query.length < 2) return [];

    try {
      // Suggestions basées sur l'historique
      const historySuggestions = searchHistory
        .filter(h => h.query.toLowerCase().includes(query.toLowerCase()))
        .map(h => h.query)
        .slice(0, 3);

      // Suggestions basées sur les catégories populaires
      const popularCategories = [
        'développement',
        'design',
        'rédaction',
        'marketing',
        'traduction',
      ].filter(c => c.includes(query.toLowerCase()));

      return [...new Set([...historySuggestions, ...popularCategories])];
    } catch (error) {
      console.error('Erreur suggestions:', error);
      return [];
    }
  }, [searchHistory]);

  // ==================== GESTION DE L'HISTORIQUE ====================

  /**
   * Sauvegarde une recherche récente
   */
  const saveRecentSearch = useCallback((query: string, type?: string) => {
    if (!query.trim()) return;

    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: query.trim(),
      type,
      timestamp: Date.now(),
    };

    setSearchHistory(prev => {
      // Éviter les doublons
      const filtered = prev.filter(s => s.query.toLowerCase() !== query.toLowerCase());
      const updated = [newSearch, ...filtered].slice(0, 10);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      return updated;
    });
  }, []);

  /**
   * Supprime une recherche récente
   */
  const removeRecentSearch = useCallback((id: string) => {
    setSearchHistory(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  /**
   * Vide l'historique des recherches
   */
  const clearRecentSearches = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('recentSearches');
  }, []);

  // ==================== RECHERCHE AVEC CACHE ====================

  /**
   * Hook pour les résultats de recherche avec cache
   */
  const useSearchResults = (query: string, filters?: SearchFilters) => {
    return useQuery({
      queryKey: searchKeys.results(query, filters),
      queryFn: () => searchAll(query, filters),
      enabled: query.length >= 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  /**
   * Hook pour les suggestions avec cache
   */
  const useSuggestions = (query: string) => {
    return useQuery({
      queryKey: searchKeys.suggestions(query),
      queryFn: () => getSearchSuggestions(query),
      enabled: query.length >= 2,
      staleTime: 60 * 1000, // 1 minute
    });
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Recherche
    searchAll,
    searchServices,
    searchFreelancers,
    searchMessages,
    
    // Suggestions
    getSearchSuggestions,
    useSuggestions,
    
    // Résultats avec cache
    useSearchResults,
    
    // Historique
    recentSearches: searchHistory,
    saveRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
};
