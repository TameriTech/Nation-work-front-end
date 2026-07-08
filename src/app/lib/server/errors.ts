import { NextResponse } from "next/server";

// Classe d'erreur backend personnalisée
export class BackendError extends Error {
  status: number;
  field?: Record<string, string[]>;
  
  constructor(message: string, status: number = 500, field?: Record<string, string[]>) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
    this.field = field;
  }
}

// Type pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
}

// Fonction principale de gestion d'erreur
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // 1. Si c'est une erreur BackendError (notre classe personnalisée)
  if (error instanceof BackendError) {
    // Si c'est une erreur de validation (422)
    if (error.status === 422 && error.field) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Erreur de validation",
          errors: error.field, // Format: { field: ["message1", "message2"] }
          code: 'validation_error'
        },
        { status: 422 }
      );
    }

    // Autres erreurs backend
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: getErrorCode(error.status),
        ...(error.field && { errors: error.field })
      },
      { status: error.status }
    );
  }

  // 2. Si c'est une erreur Zod (validation frontend)
  if (error instanceof Error && error.name === 'ZodError') {
    const zodError = error as any;
    const errors: Record<string, string[]> = {};
    
    zodError.errors?.forEach((err: any) => {
      const path = err.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });

    return NextResponse.json(
      {
        success: false,
        message: "Erreur de validation des données",
        errors: errors,
        code: 'validation_error'
      },
      { status: 422 }
    );
  }

  // 3. Erreur standard JavaScript
  if (error instanceof Error) {
    // Gérer les erreurs spécifiques
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return NextResponse.json(
        {
          success: false,
          message: "Erreur de connexion au serveur",
          code: 'network_error'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: 'internal_error'
      },
      { status: 500 }
    );
  }

  // 4. Erreur inconnue
  return NextResponse.json(
    {
      success: false,
      message: 'Erreur serveur inconnue',
      code: 'unknown_error'
    },
    { status: 500 }
  );
}

// Fonction utilitaire pour obtenir le code d'erreur
function getErrorCode(status: number): string {
  const errorCodes: Record<number, string> = {
    400: 'bad_request',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not_found',
    422: 'validation_error',
    429: 'too_many_requests',
    500: 'internal_server_error',
    503: 'service_unavailable'
  };
  return errorCodes[status] || 'unknown_error';
}

// Fonction pour formater les erreurs de validation pour react-hook-form
export function formatValidationErrorsForForm(
  errors: Record<string, string[]>,
  fieldMapping?: Record<string, string>
): Record<string, string> {
  const formatted: Record<string, string> = {};

  Object.keys(errors).forEach((backendField) => {
    const frontendField = fieldMapping?.[backendField] || backendField;
    const messages = errors[backendField];
    
    if (Array.isArray(messages) && messages.length > 0) {
      formatted[frontendField] = messages[0]; // Prendre le premier message
    }
  });

  return formatted;
}

// Fonction pour créer une erreur BackendError depuis la réponse fetch
export async function createBackendErrorFromResponse(response: Response): Promise<BackendError> {
  try {
    const data = await response.json();
    
    // Si le backend renvoie un format avec 'errors'
    if (data.errors) {
      return new BackendError(
        data.message || "Erreur de validation",
        response.status,
        data.errors
      );
    }
    
    // Si le backend renvoie un format avec 'field' (singulier)
    if (data.field) {
      const errors: Record<string, string[]> = {};
      if (typeof data.field === 'object') {
        // Si field est déjà un objet avec des tableaux
        Object.keys(data.field).forEach(key => {
          errors[key] = Array.isArray(data.field[key]) ? data.field[key] : [data.field[key]];
        });
      } else {
        // Si field est une string
        errors['general'] = [data.field];
      }
      return new BackendError(
        data.message || "Erreur de validation",
        response.status,
        errors
      );
    }
    
    // Erreur simple avec message
    return new BackendError(
      data.message || "Une erreur est survenue",
      response.status
    );
  } catch (parseError) {
    // Si le JSON est invalide
    return new BackendError(
      "Erreur de communication avec le serveur",
      response.status
    );
  }
}