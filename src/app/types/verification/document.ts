// ============================================================================
// TYPES POUR LES DOCUMENTS (KYC)
// ============================================================================

export enum DocumentType {
  ID_CARD = "id_card",
  PASSPORT = "passport",
  DRIVER_LICENSE = "driver_license",
  DIPLOMA = "diploma",
  CERTIFICATE = "certificate",
  PROFESSIONAL_CARD = "professional_card",
  BANK_RIB = "bank_rib",
  TAX_CERTIFICATE = "tax_certificate",
  CRIMINAL_RECORD = "criminal_record",
  RESIDENCE_PERMIT = "residence_permit",
  PROFILE_PICTURE = "profile_picture",
  OTHER = "other"
}

export enum DocumentStatus {
  PENDING = "pending",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  VALIDATED = "validated",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export interface Document {
  id: number;
  document_type: DocumentType;
  freelancer_id: number;
  document_url: string;
  front_image_url: string | null;
  back_image_url: string | null;
  status: DocumentStatus;
  verified_by: number | null;
  verified_at: string | null;
  rejection_reason: string | null;
  expiry_date: string | null;
  created_at: string;
  updated_at: string | undefined;
}

export interface PendingVerification {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  document_type: string;
  document_number?: string;
  front_image: string;
  back_image?: string;
  submitted_at: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface VerificationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

// Pour l'affichage dans le composant
export interface DocumentDisplay {
  id: string;
  name: string;
  submission_date: string;
  status: 'validated' | 'in_progress' | 'rejected' | 'pending';
  admin_comment?: string;
  comment_date?: string;
  document_type: DocumentType;
  file_url?: string;
  expiry_date?: string;
}

export interface CreateDocumentDto {
  document_type: DocumentType;
  file: File;
  document_number?: string;
  front_image?: File;
  back_image?: File;
  issue_date?: string;
  expiry_date?: string;
  issuing_country?: string;
}

export interface UpdateDocumentDto {
  document_type?: DocumentType;
  file?: File;
  document_number?: string;
  front_image?: File;
  back_image?: File;
  issue_date?: string;
  expiry_date?: string;
  issuing_country?: string;
}
