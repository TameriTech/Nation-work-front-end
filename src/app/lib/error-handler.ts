// services/api/client.ts

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Fonction utilitaire pour gérer les réponses API
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  // Tentative de parsing du JSON, même en cas d'erreur
  let data: any = null;
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (e) {
      // Ignorer les erreurs de parsing JSON
    }
  }

  // Si la réponse est ok, retourner les données
  if (response.ok) {
    return data as T;
  }

  // Gestion des erreurs HTTP
  const errorMessage = 
    data?.message || 
    data?.error || 
    data?.detail || 
    `Erreur ${response.status}: ${response.statusText}`;

  // Erreurs de validation (400)
  if (response.status === 400 && data?.fields) {
    throw new ValidationError(errorMessage, data.fields);
  }

  // Erreurs d'authentification (401)
  if (response.status === 401) {
    // Rediriger vers la page de connexion si token expiré
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login?session_expired=true";
    }
    throw new ApiError("Session expirée, veuillez vous reconnecter", response.status, data);
  }

  // Erreurs de permission (403)
  if (response.status === 403) {
    throw new ApiError("Vous n'avez pas les droits pour effectuer cette action", response.status, data);
  }

  // Erreurs "non trouvé" (404)
  if (response.status === 404) {
    throw new ApiError("Ressource non trouvée", response.status, data);
  }

  // Erreurs serveur (500)
  if (response.status >= 500) {
    throw new ApiError("Erreur serveur, veuillez réessayer plus tard", response.status, data);
  }

  // Autres erreurs
  throw new ApiError(errorMessage, response.status, data);
}