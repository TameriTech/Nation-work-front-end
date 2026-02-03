import { Candidature } from "@/app/types/candidatures";

export async function getCandidaturesByFreelancer(
  freelancerId: number
): Promise<Candidature[]> {
  const res = await fetch(
    `/api/candidatures/freelancer/${freelancerId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch freelancer candidatures");
  }

  return res.json();
}

export async function getServiceCandidatures(
  serviceId: number
): Promise<Candidature[]> {
  const res = await fetch(
    `/api/candidatures/service/${serviceId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch service candidatures");
  }

  return res.json();
}

export async function createCandidature(
  payload: Omit<
    Candidature,
    | "id"
    | "status"
    | "application_date"
    | "updated_at"
    | "freelancer_name"
    | "freelancer_rating"
    | "freelancer_profile_picture"
    | "service_title"
    | "service_proposed_amount"
  >
): Promise<Candidature> {
  const res = await fetch("/api/candidatures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create candidature");
  }

  return res.json();
}

export async function updateCandidatureStatus(
  candidatureId: number,
  status: "en_attente" | "acceptee" | "refusee"
): Promise<Candidature> {
  const res = await fetch(
    `/api/candidatures/${candidatureId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update candidature status");
  }

  return res.json();
}

export async function deleteCandidature(
  candidatureId: number
): Promise<void> {
  const res = await fetch(
    `/api/candidatures/${candidatureId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete candidature");
  }
}
