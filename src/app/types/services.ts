import { Candidature } from "./candidatures";
import { CATEGORY_SERVICES } from "@/data/constants";
export type CategoryName = keyof typeof CATEGORY_SERVICES;

export type JobStatus = "completed" | "canceled" | "inProgress";

export interface JobCardProps {
  id: number;
  title: string;
  price: string;
  duration: string;
  status?: JobStatus;
  showRate?: boolean;
  type: string;
  description: string;
  skills: string[];
  location: string;
  rating?: number;
  postedDate: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
}


export interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  service_type: "standard" | "premium";
  category_id: number;
  date_pratique: string;
  start_time: string;
  duration: string;
  address: string;
  city: string;
  quarter: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  required_skills: string[];
  proposed_amount: number;
  accepted_amount: number;
  status: "published" | "draft" | "completed";
  client_id: number;
  assigned_freelancer_id: number;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_rating: number;
  client_email: string;
  client_phone: string;
  client_total_services: number;
  client_acceptance_rate: number;
  images: string[];
  candidatures?: Candidature[];
  provider?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  } | null;
}



export interface CreateServicePayload {
  title: string;
  short_description: string;
  full_description: string;
  service_type: "standard" | "premium";
  category_id: number;
  date_pratique: string;
  start_time: string;
  duration: string;
  address: string;
  city: string;
  required_skills: string[];
  proposed_amount: number;
  accepted_amount: number;
  images?: string[];
  quarter: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  status: "published" | "draft" | "completed";
}


export interface UpdateServicePayload {
  title?: string;
  short_description?: string;
  full_description?: string;
  service_type?: "standard" | "premium";
  category_id?: number;
  date_pratique?: string;
  start_time?: string;
  duration?: string;
  address?: string;
  city?: string;
  required_skills?: string[];
  proposed_amount?: number;
  accepted_amount?: number;
  status?: "published" | "draft" | "completed";
  images?: string[];
  quarter: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface FromCategory {
  id: number;
  name: string;
}

export type ServiceFormValues = CreateServicePayload;
