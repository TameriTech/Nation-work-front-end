// src/app/types/verification/index.ts
import { DocumentType, DocumentStatus, VerificationLevel } from '../enums';
import { providerProfileOut } from '../users';

export interface providerVerificationBase {
  document_type: DocumentType;
  document_number?: string;
  issuing_country?: string;
  issuing_authority?: string;
  notes?: string;
}

export interface providerVerificationCreate extends providerVerificationBase {
  document_url: string;
  front_image_url?: string;
  back_image_url?: string;
  selfie_url?: string;
  issue_date?: string;
  expiry_date?: string;
}

export interface providerVerificationUpdate {
  status: DocumentStatus;
  rejection_reason?: string;
  rejection_details?: Record<string, any>;
  notes?: string;
  expiry_date?: string;
  verification_level?: string;
}

export interface providerVerificationOut extends providerVerificationBase {
  id: number;
  provider_id: number;
  document_url: string;
  front_image_url?: string;
  back_image_url?: string;
  selfie_url?: string;
  status: DocumentStatus;
  verification_level: string;
  verified_by?: number;
  verified_by_name?: string;
  verified_at?: string;
  rejection_reason?: string;
  rejection_details?: Record<string, any>;
  issue_date?: string;
  expiry_date?: string;
  risk_score: number;
  created_at: string;
  updated_at?: string;
  provider: providerProfileOut;
}

export interface KYCProgressOut {
  total_documents: number;
  verified_count: number;
  pending_count: number;
  rejected_count: number;
  expired_count: number;
  progress_percentage: number;
  overall_status: 'complete' | 'pending' | 'incomplete';
  documents_by_status: Record<string, providerVerificationOut[]>;
  validated_documents: providerVerificationOut[];
  pending_documents: providerVerificationOut[];
  rejected_documents: providerVerificationOut[];
}

export interface DocumentDisplay extends providerVerificationOut {
  document_url: string;
  document_type_display?: string;
  status_display?: string;
}

export interface PendingVerification {
  id: number;
  provider_id: number;
  provider_name: string;
  document_type: DocumentType;
  document_type_display: string;
  status: DocumentStatus;
  created_at: string;
  document_url: string;
}

export interface VerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  expired: number;
  by_type: Record<string, number>;
}
