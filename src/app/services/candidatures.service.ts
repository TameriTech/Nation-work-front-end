import { apiClient } from "../lib/api-client";
import { Candidature } from "../types/candidatures";


export function getCandidaturesByFreelancer(freelancerId: number) {
  return apiClient<Candidature[]>(`/freelancers/${freelancerId}/candidatures`, {
    method: "GET",
  });
}

export function getServiceCandidatures(serviceId: number) {
  return apiClient<Candidature[]>(`/candidatures/services/${serviceId}`, {
    method: "GET",
  });
}

export function createCandidature(payload: Omit<Candidature, "id" | "status" | "application_date" | "updated_at" | "freelancer_name" | "freelancer_rating" | "freelancer_profile_picture" | "service_title" | "service_proposed_amount">) {
  return apiClient<Candidature>("/candidatures", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCandidatureStatus(candidatureId: number, status: "en_attente" | "acceptee" | "refusee") {
  return apiClient<Candidature>(`/candidatures/${candidatureId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function deleteCandidature(candidatureId: number) {
  return apiClient<void>(`/candidatures/${candidatureId}`, {
    method: "DELETE",
  });
}