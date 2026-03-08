// ============================================================================
// TYPES DE BASE POUR LES RÉPONSES API
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
