// app/services/reviews.service.ts

import { PaginatedResponse, Review, ReviewStats, ReviewFilters } from "@/app/types";
import { handleResponse } from '../lib/error-handler';

/**
 * Récupère les avis de l'utilisateur connecté
 */
export async function getMyReviews(filters?: ReviewFilters): Promise<PaginatedResponse<Review>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/reviews/my-reviews?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<PaginatedResponse<Review>>(res);
  } catch (error) {
    console.error('Erreur getMyReviews:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques des avis
 */
export async function getReviewStats(): Promise<ReviewStats> {
  try {
    const res = await fetch('/api/reviews/my-reviews/stats', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<ReviewStats>(res);
  } catch (error) {
    console.error('Erreur getReviewStats:', error);
    throw error;
  }
}

/**
 * Crée un nouvel avis
 */
export async function createReview(
  serviceId: number,
  reviewData: {
    rating: number;
    communication_rating?: number;
    quality_rating?: number;
    deadline_rating?: number;
    professionalism_rating?: number;
    comment: string;
    private_feedback?: string;
    is_public?: boolean;
  }
): Promise<Review> {
  try {
    const res = await fetch(`/api/reviews/services/${serviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    return await handleResponse<Review>(res);
  } catch (error) {
    console.error('Erreur createReview:', error);
    throw error;
  }
}

/**
 * Met à jour un avis existant
 */
export async function updateReview(
  reviewId: number,
  reviewData: Partial<{
    comment: string;
    private_feedback?: string;
    is_public?: boolean;
  }>
): Promise<Review> {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    return await handleResponse<Review>(res);
  } catch (error) {
    console.error(`Erreur updateReview ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Supprime un avis
 */
export async function deleteReview(reviewId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteReview ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Répond à un avis reçu
 */
export async function respondToReview(
  reviewId: number,
  response: string
): Promise<{ message: string; review: Review }> {
  try {
    const res = await fetch(`/api/reviews/${reviewId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response }),
    });

    return await handleResponse<{ message: string; review: Review }>(res);
  } catch (error) {
    console.error(`Erreur respondToReview ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Met à jour une réponse existante
 */
export async function updateResponse(
  reviewId: number,
  response: string
): Promise<{ message: string; review: Review }> {
  try {
    const res = await fetch(`/api/reviews/${reviewId}/response`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response }),
    });

    return await handleResponse<{ message: string; review: Review }>(res);
  } catch (error) {
    console.error(`Erreur updateResponse ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Supprime une réponse
 */
export async function deleteResponse(reviewId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/reviews/${reviewId}/response`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteResponse ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Marque un avis comme utile
 */
export async function markReviewHelpful(reviewId: number): Promise<{
  review_id: number;
  helpful_count: number;
  user_vote: 'added' | 'removed';
}> {
  try {
    const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<{
      review_id: number;
      helpful_count: number;
      user_vote: 'added' | 'removed';
    }>(res);
  } catch (error) {
    console.error(`Erreur markReviewHelpful ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Récupère les services disponibles pour laisser un avis
 */
export async function getReviewableServices(): Promise<Array<{
  id: number;
  title: string;
  provider_id: number;
  provider_name: string;
  completed_at: string;
}>> {
  try {
    const res = await fetch('/api/reviews/reviewable-services', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<Array<{
      id: number;
      title: string;
      provider_id: number;
      provider_name: string;
      completed_at: string;
    }>>(res);
  } catch (error) {
    console.error('Erreur getReviewableServices:', error);
    throw error;
  }
}

/**
 * Récupère un avis par son ID
 */
export async function getReviewById(reviewId: number): Promise<Review> {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<Review>(res);
  } catch (error) {
    console.error(`Erreur getReviewById ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Récupère les statistiques d'un provider
 */
export async function getproviderReviewStats(providerId: number): Promise<ReviewStats> {
  try {
    const res = await fetch(`/api/reviews/provider/${providerId}/stats`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<ReviewStats>(res);
  } catch (error) {
    console.error(`Erreur getproviderReviewStats ${providerId}:`, error);
    throw error;
  }
}


// ==================== REVIEWS ====================

export async function getproviderReviews(providerId: number, skip = 0, limit = 20): Promise<Review[]> {
  try {
    const res = await fetch(`/api/users/reviews/provider/${providerId}?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<Review[]>(res);
  } catch (error) {
    console.error("Erreur getproviderReviews:", error);
    throw error;
  }
}
