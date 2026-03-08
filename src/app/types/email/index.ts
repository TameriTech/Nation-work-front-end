// ============================================================================
// TYPES POUR LES EMAILS
// ============================================================================

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface EmailData {
  subject: string;
  message: string;
}
