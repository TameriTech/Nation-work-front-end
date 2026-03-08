import { User } from "../auth/user";

// ============================================================================
// TYPES POUR LES FREELANCERS
// ============================================================================

export interface Freelancer  extends User {
  average_rating: number;
  total_reviews: number;
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
  avg_response_time?: number;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
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

export interface CreateReviewDto {
  serviceId: number;
  rating: number;
  comment?: string;
}

export interface FreelancerFullProfile extends FreelancerProfile {
  user: User;
  experiences: ProfessionalExperience[];
  educations: Education[];
  skills: FreelancerSkill[];
}
