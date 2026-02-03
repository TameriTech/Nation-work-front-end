import {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/app/types/services";

export async function createService(
  payload: CreateServicePayload
): Promise<Service> {
  const res = await fetch("/api/services/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create service");
  return res.json();
}

export async function getServices(): Promise<Service[]> {
  const res = await fetch("/api/services", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getService(serviceId: number): Promise<Service> {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch service");
  return res.json();
}

export async function getClientServices(): Promise<Service[]> {
  const res = await fetch("/api/services/client/list", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch client services");
  return res.json();
}

export async function searchServices(
  query: string
): Promise<Service[]> {
  const res = await fetch(
    `/api/services/search?query=${encodeURIComponent(query)}`,
    { method: "GET", cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to search services");
  return res.json();
}

export async function updateService(
  serviceId: number,
  payload: UpdateServicePayload
): Promise<Service> {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

export async function destroyService(
  serviceId: number
): Promise<void> {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete service");
}

export async function getServicesByFreelancer(
  freelancerId: number
): Promise<Service[]> {
  const res = await fetch(
    `/api/services/freelancer/${freelancerId}`,
    { method: "GET", cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch freelancer services");
  return res.json();
}

export async function assignFreelancerToService(
  serviceId: number,
  freelancerId: number
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/assign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancer_id: freelancerId }),
    }
  );

  if (!res.ok) throw new Error("Failed to assign freelancer");
  return res.json();
}

export async function markServiceAsCompleted(
  serviceId: number
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/complete`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to mark service as completed");
  return res.json();
}

export async function uploadServiceImages(
  serviceId: number,
  images: string[]
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/images`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    }
  );

  if (!res.ok) throw new Error("Failed to upload service images");
  return res.json();
}

export async function removeServiceImage(
  serviceId: number,
  imageId: number
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/images/${imageId}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to remove service image");
  return res.json();
}
