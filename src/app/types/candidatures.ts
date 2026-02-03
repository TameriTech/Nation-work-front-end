import { Service } from "./services"

export interface Freelancer {
  id: number,
  name: string,
  email: string,
  phone?: string,
  role?: "freelancer" | "admin",
  avatar?: string,
  average_rating: number,
  total_reviews: number
}

export interface Candidature {
  id: number,
  service_id: number,
  service: Service,
  status: "pending" | "accepted" | "rejected" | "canceled",
  freelancer_id: number,
  cover_letter: string,
  application_date: string,
  updated_at: string,
  provider: Freelancer,
}