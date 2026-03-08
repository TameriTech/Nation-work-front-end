import { Document, DocumentType, DocumentStatus } from "./document";

// ============================================================================
// TYPES POUR LE KYC
// ============================================================================

export interface KYCStatus {
  overall_status: 'pending' | 'in_progress' | 'verified' | 'rejected';
  required_documents: DocumentType[];
  submitted_documents: Document[];
  validated_documents: Document[];
  rejected_documents: Document[];
  pending_documents: Document[];
  verified_count: number;
  pending_count: number;
  rejected_count: number;
  completion_percentage: number;
}
