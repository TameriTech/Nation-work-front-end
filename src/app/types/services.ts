import { Candidature } from "./candidatures";
import { CATEGORY_SERVICES } from "@/data/constants";
import { User } from "./user";
export type CategoryName = keyof typeof CATEGORY_SERVICES;

export type ServiceStatus = "published" | "canceled" | "in_progress" | "completed" | "draft";
export type JobStatus = "completed" | "canceled" | "in_progress";
export type ServiceType = "standard" | "premium";


export interface JobCardProps {
  service: Service;
  isVerified?: boolean;
  isFavorite?: boolean;
  showRate?: boolean;
  onFavoriteClick?: () => void;
}


export interface Client{
  id: number;
  name: string;
  email: string;
  role?: "client" | "freelancer" | "admin";
  avatar?: string;
  rating: number;
  total_services: number;
  acceptance_rate: number;
}

export interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  service_type: ServiceType;
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

  status: ServiceStatus;

  client_id: number;
  assigned_freelancer_id?: number | null;

  created_at: string;
  updated_at: string;

  client: Client;
  images: string[];

  candidatures?: Candidature[];
  provider?: User | null;
}



export interface CreateServicePayload {
  title: string;
  short_description: string;
  full_description: string;
  service_type: ServiceType;
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

  images?: string[];
  status: ServiceStatus;
}



export type UpdateServicePayload = Partial<CreateServicePayload>;


export interface FromCategory {
  id: number;
  name: string;
}

export type ServiceFormValues = CreateServicePayload;

