import { Service } from "./service";
import { Freelancer } from "../users/freelancer";

// ============================================================================
// TYPES POUR LES CANDIDATURES
// ============================================================================

export type CandidatureStatus = "pending" | "accepted" | "rejected" | "canceled" | "withdrawn";

export interface Candidature {
  id: number;
  service_id: number;
  service?: Service;
  freelancer_id: number;
  freelancer?: Freelancer;
  provider?: Freelancer;
  message?: string;
  cover_letter: string;
  proposed_amount?: number;
  estimated_duration?: string;
  status: CandidatureStatus;
  application_date: string;
  updated_at: string;
  
  // Champs joints (legacy)
  freelancer_name?: string;
  freelancer_rating?: number;
  freelancer_profile_picture?: string;
  service_title?: string;
  service_proposed_amount?: number;
}


export interface Candidate {
  created_at: string,
  email: string,
  id: 1,
  message: string,
  name: string,
  proposed_amount: number,
}


export interface CandidatureStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  acceptanceRate: number;
}

export interface CreateCandidatureDto {
  service_id: number;
  message?: string;
  cover_letter: string;
  proposed_amount?: number;
  estimated_duration?: string;
}

export interface UpdateCandidatureStatusDto {
  status: CandidatureStatus;
  rejection_reason?: string;
  message?: string;
}
