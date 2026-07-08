import { Address, User } from "../auth";
import { Category } from "../categories";
import { MissionStatus, MissionUrgency } from "../enums";

export interface Mission {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  budget_range: string;
  scheduled_at: string | null;
  status: MissionStatus;
  status_label: string;
  urgency: MissionUrgency;
  urgency_label: string;
  created_at: string;
  updated_at: string;

  client: User;
  provider?: User | null;
  category: Category;
  address: Address;
  attachments: MissionAttachment[];
  quotes_count?: number;
  has_booking?: boolean;
}


export interface MissionAttachment {
  id: string;
  file_url: string;
  file_type: 'image' | 'video' | 'pdf' | 'document';
  file_type_label: string;
  created_at: string;
}

export interface MissionCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: string | null;
  level: number;
  full_path: string;
  children_count: number;
}

export interface MissionAddress {
  id: string;
  country: string;
  city: string;
  district: string;
  neighborhood: string | null;
  street: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  full_address: string;
  short_address: string;
}

export interface MissionClient {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'client' | 'provider' | 'moderator' | 'admin' | 'super_admin';
  email: string;
  avatar: string | null;
  phone: string | null;
}

export interface MissionProvider {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  average_rating: number;
  completed_missions: number;
}

export interface MissionQuote {
  id: string;
  provider_id: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  provider: MissionProvider;
  created_at: string;
}

export interface MissionBooking {
  id: string;
  provider_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  provider: MissionProvider;
  created_at: string;
}


export interface MissionStatsResponse {}

export interface MissionDashboardResponse {}


export interface MissionFilter {
  page: number;
  per_page: number;
  sort_by: "created_at" | "budget_min" | "budget_max" | "urgency" | "scheduled_at";
  sort_direction: "asc" | "desc";
  status?: MissionStatus
  category_id?: string | undefined;
  budget_min?: number | undefined;
  budget_max?: number | undefined;
  date_from?: string | undefined;
  date_to?: string | undefined;
  city?: string | undefined;
  district?: string | undefined;
  urgency?: MissionUrgency | undefined;
  search?: string | undefined;
}
