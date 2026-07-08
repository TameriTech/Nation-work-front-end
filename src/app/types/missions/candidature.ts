

// ==================== CREATE DTO ====================

import { providerBasicInfo } from "../auth";
import { CandidatureStatus, DurationUnit } from "../enums";
import { Education } from "../users";

import { ServiceBasicInfo } from "./service";

export interface CreateCandidatureDto {
  service_id: number;
  proposed_price?: number;
  estimated_duration?: string;
  estimated_duration_unit?: DurationUnit;
  estimated_duration_days?: number;
  cover_letter?: string;
  proposed_start_date?: string;
  availability_confirmed?: boolean;
}

// ==================== UPDATE DTO ====================

export interface UpdateCandidatureStatusDto {
  status: CandidatureStatus;
  rejection_reason?: string;
  message?: string;
  shortlist_notes?: string;
  client_notes?: string;
}

export interface ShortlistCandidatureDto {
  is_shortlisted: boolean;
  shortlist_notes?: string;
}

// ==================== RESPONSE TYPES ====================

export interface Candidature {
  id: number;
  service_id: number;
  provider_id: number;
  proposed_price?: number;
  estimated_duration?: string;
  estimated_duration_days?: number;
  cover_letter?: string;
  proposed_start_date?: string;
  availability_confirmed: boolean;
  status: CandidatureStatus;
  is_shortlisted: boolean;
  shortlist_notes?: string;
  viewed_by_client: boolean;
  viewed_at?: string;
  application_date: string;
  updated_at?: string;
  responded_at?: string;
  
  // Joined fields (optional)
  provider: providerBasicInfo;
  
  // Extended fields for detailed views
  provider_skills?: string[];
  provider_experience_years?: number;
  provider_verification_status?: Record<string, boolean>;
  provider_badges?: string[];
  provider_recent_services?: Array<Record<string, any>>;
  
  service?: ServiceBasicInfo;
  client_rating?: number;
  client_total_services?: number;
  other_applicants_count?: number;
  
  answers?: Array<Record<string, any>>;
}

export interface ClientCandidature extends Candidature {
  provider_skills: string[];
  provider_experience_years?: number;
  provider_verification_status?: Record<string, boolean>;
  provider_badges: string[];
  provider_recent_services: Array<Record<string, any>>;
}

export interface providerCandidature extends Candidature {
  service: ServiceBasicInfo;
  client_rating?: number;
  client_total_services?: number;
  other_applicants_count?: number;
}

// ==================== RESPONSES ====================

export interface AcceptCandidatureResponse {
  message: string;
  candidature_id: number;
  service_id: number;
  service_code: string;
  service_title: string;
  provider_id: number;
  provider_name: string;
  service_status: string;
  redirect_url?: string;
}

export interface RejectCandidatureResponse {
  message: string;
  candidature_id: number;
  service_id: number;
}

export interface WithdrawCandidatureResponse {
  message: string;
  candidature_id: number;
  service_id: number;
}

export interface ShortlistCandidatureResponse {
  message: string;
  candidature_id: number;
  candidature: Candidature;
  is_shortlisted: boolean;
  shortlist_notes?: string;
}

// ==================== STATISTICS ====================

export interface CandidatureStats {
  total: number;
  by_status: Record<string, number>;
  average_proposed_price: number;
  average_response_time?: number;
  application_trend: Record<string, number>;
}

export interface providerCandidatureStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  shortlisted: number;
  taux_reussite: number;
}

export interface ServiceCandidatureStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  shortlisted: number;
}


// ==================== CHECK RESPONSE ====================

export interface CheckCanApplyResponse {
  can_apply: boolean;
  reason?: string;
}






// types/candidature.ts

// ==================== provider ====================

export interface providerProfileForDialog {
  id: number;
  username: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_picture: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  local_time: string | null;           // e.g. "1:41 pm"
  job_success_percentage: number | null; // 0-100
  bio: string | null;
  professional_title: string | null;
  tagline: string | null;
}

// ==================== STATS ====================

export interface providerEarningStats {
  recent_earnings: number;
  recent_jobs: number;
  recent_hours: number;
  lifetime_earnings: number;
  lifetime_jobs: number;
  lifetime_hours: number;
  average_rating: number;             // 0-5
  total_hours_worked: number;
}

// ==================== SKILLS ====================


// ==================== EXPERIENCES ====================

export interface ProfessionalExperience {
  id: number;
  position: string;
  company: string;
  location: string | null;
  description: string | null;
  start_date: string;                 // ISO date
  end_date: string | null;
  is_current: boolean;
  duration_display: string | null;    // e.g. "2 yrs 3 mos"
  employment_type: string | null;
}

// ==================== EDUCATION ====================


// ==================== PORTFOLIO ====================

export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  project_url: string | null;
  thumbnail_url: string | null;
}

// ==================== WORK HISTORY ====================

export interface CompletedServiceHistory {
  service_id: number;
  title: string;
  category: string | null;
  completed_date: string | null;      // ISO date
  client_name: string | null;
  rating: number | null;              // 1-5
  start_date: string | null;          // ISO date
  end_date: string | null;            // ISO date
  total_amount: number;
  hourly_rate: number | null;
  hours_worked: number | null;
  review_comment: string | null;
}

// ==================== MAIN RESPONSE ====================

export interface CandidateDialogResponse {
  // Candidature
  candidature_id: number;
  service_id: number;
  provider_id: number;
  cover_letter: string | null;
  proposed_price: number | null;
  estimated_duration_days: number | null;
  estimated_duration_value: number | null;
  estimated_duration_unit: DurationUnit | null;
  status: CandidatureStatus;
  application_date: string;           // ISO date
  is_shortlisted: boolean;

  // provider profile
  provider: providerProfileForDialog;

  // Stats
  earnings_stats: providerEarningStats;

  // Detailed data
  skills: providerSkill[];
  experiences: ProfessionalExperience[];
  educations: Education[];
  portfolio_projects: PortfolioItem[];
  completed_services_history: CompletedServiceHistory[];

  // Service
  service_status: string;

  // Computed fields (from backend)
  can_assign: boolean;
  display_location: string;
  job_success_display: string | null;  // e.g. "100% Job Success"
  rating_star_display: number | null;  // 0-5

  // Timestamps
  created_at: string;                 // ISO date
  updated_at: string | null;          // ISO date
}