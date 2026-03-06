export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: 'client' | 'freelancer' | 'admin' | 'super_admin' | 'moderator';
  phone_number?: string;
  is_active: boolean;
  rating?: number;
  is_verified: boolean;
  verified_badge?: boolean;
  top_rated?: boolean;
  phone?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  suspension_reason?: string;
  suspended_until?: string;
  pending_documents?: string[];
  stats?: {
    services_posted?: number;
    services_completed?: number;
    total_spent?: number;
    total_earned?: number;
    average_rating?: number;
    response_rate?: number;
    completion_rate?: number;
  };
}

export interface FreelancerProfile {
  id: number;
  userId: number;
  user?: User;
  study_level?: string;
  last_diploma?: string;
  primary_skill?: string;
  secondary_skill?: string;
  other_skills?: string;
  years_experience: number;
  hourly_rate: number;
  address?: string;
  quarter?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  summary?: string;
  nationality?: string;
  gender?: string;
  age?: number;
  is_available: boolean;
  average_rating: number;
  total_reviews: number;
  completion_rate: number;
  profile_completion: number;
  created_at: string;
  response_rate?: number;
  avg_response_time?:number;
}

export interface UpdateFreelancerProfileData {
  study_level?: string | null;
  last_diploma?: string | null;
  primary_skill?: string | null;
  secondary_skill?: string | null;
  other_skills?: string | null;
  address?: string | null;
  quarter?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  phone_number?: string | null;
  years_experience?: number | null;
  hourly_rate?: number | null;
  is_available?: boolean | null;
  summary?: string | null;
  nationality?: string | null;
  gender?: string | null;
  age?: number | null;
}

export interface FreelancerProfileUpdate{

}

export interface ProfessionalExperience {
  id: number;
  position: string;
  company: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  icon_bg: '#E0E7FF';
  icon: 'bi:briefcase';
  location?: string;
}

export interface Education {
  id: number;
  school: string;
  degree?: string;
  field_of_study?: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  icon_bg: '#E0E7FF';
  icon: 'lucide:graduation-cap';
  grade?: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface FreelancerSkill {
  id: number;
  skill_id: number;
  skill: Skill;
  skill_type: 'primary' | 'secondary' | 'other';
  proficiency_level: number;
}

export interface Review {
  id: number;
  service_id: number;
  client_id: number;
  freelancer_id: number;
  rating: number;
  comment?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  freelancer_response?: string;
  response_date?: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
}

export interface FreelancerFullProfile extends FreelancerProfile {
  user: User;
  experiences: ProfessionalExperience[];
  educations: Education[];
  skills: FreelancerSkill[];
}


// types/document.ts

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

// ==================== DTOs ====================

export interface UpdateFreelancerProfileDto {
  study_level?: string;
  last_diploma?: string;
  primary_skill?: string;
  secondary_skill?: string;
  other_skills?: string;
  address?: string;
  quarter?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  summary?: string;
  nationality?: string;
  gender?: string;
  age?: number;
  years_experience?: number;
  hourly_rate?: number;
  is_available?: boolean;
}

export interface CreateExperienceDto {
  position: string;
  company: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
}

export interface UpdateExperienceDto {
  position?: string;
  company?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
}

export interface CreateEducationDto {
  school: string;
  degree?: string;
  field_of_study?: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  grade?: string;
}

export interface UpdateEducationDto {
  school?: string;
  degree?: string;
  field_of_study?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  grade?: string;
}

export interface CreateReviewDto {
  serviceId: number;
  rating: number;
  comment?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  username: string;
  password: string;
  role: 'client' | 'freelancer';
  phoneNumber?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_role: string;
  user_id: number;
}

