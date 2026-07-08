// src/app/types/users/provider.ts
import { UserOut } from '../auth/user';
import { LocationInfo, SocialLinks } from '../common/pagination';
import { EmploymentType, LocationType, SkillLevel, SkillStatus, SkillType } from '../enums';
import { Review } from '../reviews';


// types/provider.ts

export interface providerProfile {
  // Basic Info
  id: number;
  user_id: number;
  professional_title: string | null;
  professional_summary: string | null;
  tagline: string | null;
  
  // Languages
  languages: string[];
  
  // Availability
  is_available: boolean;
  willing_to_relocate: boolean;
  
  // Financial
  hourly_rate: number | null;
  
  // Verification
  verified_at: string | null;
  
  // Timestamps
  created_at: string | null;
  updated_at: string | null;
  profile_completed_at: string | null;
  last_activity_at: string | null;
  
  // Calculated properties
  has_complete_profile: boolean;
  total_experience_years: number;

  user: UserProfile;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'super_admin' | 'provider' | 'client';
  profile_picture: string | null;
  bio: string | null;
  phone_number: string | null;
  city: string | null;
  country: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string | null;
  updated_at: string | null;
  date_of_birth: string | null;
  provider_profile?: providerProfile | null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Types & constantes ───────────────────────────────────────────────────────

export type LanguageLevel = "basic" | "conversational" | "fluent" | "native";

export interface Language {
  language: string;
  level: LanguageLevel;
}

export const LANGUAGE_LEVELS: { value: LanguageLevel; label: string; icon: string }[] = [
  { value: "basic",          label: "Débutant",          icon: "ph:student" },
  { value: "conversational", label: "Conversationnel",   icon: "ph:chat-circle" },
  { value: "fluent",         label: "Courant",            icon: "ph:check-circle" },
  { value: "native",         label: "Natif / Bilingue",  icon: "ph:star" },
];

export const COMMON_LANGUAGES = [
  "Français", "Anglais", "Espagnol", "Arabe", "Allemand",
  "Portugais", "Italien", "Mandarin", "Japonais", "Russe",
  "Hindi", "Coréen", "Turc", "Néerlandais", "Polonais",
];

// Version avec toutes les relations (optionnelle)
export interface FullproviderProfile extends providerProfile {
  experiences: Experience[];
  educations: Education[];
  portfolios: Portfolio[];
  categories: Category[];
  service_offerings: ServiceOffering[];
  skills: Skill[];
  qualifications: Qualification[];
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  description: string | null;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  description: string | null;
}

export interface Portfolio {
  id: number;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  created_at: string | null;
}


export interface ServiceOffering {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  delivery_time: number | null;
  is_active: boolean;
}

export interface Skill {
  id: number;
  skill_id: number;
  name: string | null;
  years_experience: number | null;
  level: string | null;
  endorsements_count: number;
}

export interface Qualification {
  id: number;
  title: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  url: string | null;
}

export interface providerPublicProfileOut {
}

// ============ PROFESSIONAL EXPERIENCE ============
export interface ProfessionalExperienceBase {
  position: string;
  position_level?: string;
  employment_type: EmploymentType;
  company: string;
  company_description?: string;
  company_website?: string;
  company_logo?: string;
  company_size?: string;
  company_industry?: string;
  location?: string;
  location_type: LocationType;
  country?: string;
  city?: string;
  description?: string;
  achievements: string[];
  responsibilities: string[];
  technologies_used: string[];
  start_date: string;
  end_date?: string;
  is_current: boolean;
  is_public: boolean;
}

export interface ProfessionalExperienceCreate extends ProfessionalExperienceBase {}

export interface ProfessionalExperienceUpdate {
  position?: string;
  position_level?: string;
  employment_type?: EmploymentType;
  company?: string;
  company_description?: string;
  company_website?: string;
  company_logo?: string;
  description?: string;
  achievements?: string[];
  responsibilities?: string[];
  technologies_used?: string[];
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
  location_type?: LocationType;
  is_public?: boolean;
}

export interface ProfessionalExperienceOut extends ProfessionalExperienceBase {
  id: number;
  provider_profile_id: number;
  duration_months?: number;
  duration_display?: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

// ============ EDUCATION ============

export interface EducationBase {
  school: string;
  degree?: string;
  field_of_study?: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  grade?: string;
  activities?: string;
  logo_url?: string;
}

export interface EducationCreate extends EducationBase {}

export interface EducationUpdate {
  school?: string;
  degree?: string;
  field_of_study?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  grade?: string;
  activities?: string;
  logo_url?: string;
}

export interface EducationOut extends EducationBase {
  id: number;
  provider_profile_id: number;
  created_at: string;
  updated_at?: string;
}

// ============ SKILLS ============

export interface SkillBase {
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  type: SkillType;
  subcategory?: string;
  parent_id?: number;
  aliases: string[];
  keywords: string[];
  icon_url?: string;
}

export interface SkillCreate extends SkillBase {}

export interface SkillUpdate {
  name?: string;
  description?: string;
  category?: string;
  type?: SkillType;
  subcategory?: string;
  parent_id?: number;
  aliases?: string[];
  keywords?: string[];
  icon_url?: string;
  status?: SkillStatus;
}

export interface SkillOut extends SkillBase {
  id: number;
  status: SkillStatus;
  usage_count: number;
  job_demand_score: number;
  average_proficiency: number;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SkillWithChildren extends SkillOut {
  children: SkillOut[];
}

export interface providerSkillBase {
  skill_id: number;
  skill_type: 'primary' | 'secondary' | 'other';
  proficiency_level: number;
  proficiency_label?: SkillLevel;
  years_experience?: number;
  months_experience?: number;
  is_verified: boolean;
}

export interface providerSkillCreate extends providerSkillBase {}

export interface providerSkillUpdate {
  skill_type?: 'primary' | 'secondary' | 'other';
  proficiency_level?: number;
  proficiency_label?: SkillLevel;
  years_experience?: number;
  is_verified?: boolean;
}

export interface providerSkillOut extends providerSkillBase {
  id: number;
  provider_profile_id: number;
  skill: SkillOut;
  last_used?: string;
  portfolio_items: number[];
  certifications: Record<string, any>[];
  created_at: string;
}

export interface SkillEndorsementBase {
  skill_id: number;
  comment?: string;
  relationship_type?: string;
}

export interface SkillEndorsementCreate extends SkillEndorsementBase {}

export interface SkillEndorsementOut extends SkillEndorsementBase {
  id: number;
  provider_profile_id: number;
  author_id: number;
  author_name: string;
  author_avatar?: string;
  weight: number;
  created_at: string;
}

// ============ provider PROFILE ============


export interface providerProfileBase {
  professional_title?: string;
  summary?: string;
  user?: UserOut;
  study_level?: 'bac' | 'bac+2' | 'bac+3' | 'bac+5' | 'bac+8' | 'autre';
  last_diploma?: string;
  years_experience: number;
  hourly_rate: number;
  is_available: boolean;
  availability_type?: string;
  max_weekly_hours?: number;
  location?: LocationInfo;
  nationality?: string;
  gender?: string;
  date_of_birth?: string;
  average_rating?: number;
  social_links?: SocialLinks;
  languages?: Array<{ language: string; level: string }>;
}

export interface providerProfileOut extends providerProfileBase {
  id: number;
  user_id: number;
  user?: UserOut;
  total_services: number;
  completed_services: number;
  total_earnings: number;
  average_rating: number;
  total_reviews: number;
  response_rate: number;
  completion_rate: number;
  on_time_delivery_rate: number;
  is_identity_verified: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_payment_verified: boolean;
  verification_score: number;
  badges: string[];
  profile_completion: number;
  created_at: string;
  updated_at?: string;
  last_active_at?: string;
  primary_skill: string[];
  secondary_skill: string[];
  skills_list: string[];
}

export interface providerProfileUpdate extends Partial<providerProfileBase> {}

export interface providerFullProfileOut extends providerProfileOut {
  user: UserOut;
  experiences: ProfessionalExperienceOut[];
  educations: EducationOut[];
  skills: providerSkillOut[];
  recent_reviews: Review[];
  average_rating: number;
  total_reviews: number;
  completion_rate: number;
  on_time_delivery_rate: number;
  rehire_rate: number;
  category_stats: Record<string, Record<string, any>>;
  badges: string[];
  verification_status: Record<string, boolean>;
  profile_views: number;
}

// ============ REVIEWS ============

