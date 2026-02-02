import { apiClient } from "../lib/api-client";
import { Service, CreateServicePayload, UpdateServicePayload } from "../types/services";



export function createService(payload: CreateServicePayload) {
  return apiClient<Service>("/services/publish", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getServices() {
  return apiClient<Service[]>("/services", {
    method: "GET",
  });
}

export function getService(serviceId: number) {
  return apiClient<Service>(`/services/${serviceId}`, {
    method: "GET",
  });
}

export function getClientServices() {
  return apiClient<Service[]>("/services/client/list", {
    method: "GET",
  });
}

export function searchServices(query: string) {
  return apiClient<Service[]>(`/services/search?query=${encodeURIComponent(query)}`, {
    method: "GET",
  });
}



export function getServiceById(serviceId: number) {
  return apiClient<Service>(`/services/${serviceId}`, {
    method: "GET",
  });
}



export function updateService(serviceId: number, payload: UpdateServicePayload) {
  return apiClient<Service>(`/services/${serviceId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteService(serviceId: number) {
  return apiClient<void>(`/services/${serviceId}`, {
    method: "DELETE",
  });
}

export function getServicesByClient() {
  return apiClient<Service[]>(`/services/client/list`, {
    method: "GET",
  });
}

export function getServicesByFreelancer(freelancerId: number) {
  return apiClient<Service[]>(`/freelancers/${freelancerId}/services`, {
    method: "GET",
  });
}

export function assignFreelancerToService(serviceId: number, freelancerId: number) {
  return apiClient<Service>(`/services/${serviceId}/assign`, {
    method: "POST",
    body: JSON.stringify({ freelancer_id: freelancerId }),
  });
}

export function markServiceAsCompleted(serviceId: number) {
  return apiClient<Service>(`/services/${serviceId}/complete`, {
    method: "POST",
  });
}

export function uploadServiceImages(serviceId: number, images: string[]) {
  return apiClient<Service>(`/services/${serviceId}/images`, {
    method: "POST",
    body: JSON.stringify({ images }),
  });
}

export function removeServiceImage(serviceId: number, imageId: number) {
  return apiClient<Service>(`/services/${serviceId}/images/${imageId}`, {
    method: "DELETE",
  });
}