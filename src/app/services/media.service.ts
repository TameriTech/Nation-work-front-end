// services/media.service.ts
import { MediaConfig, FileUploadResponse } from "@/app/types";

export async function getMediaConfig(): Promise<MediaConfig> {
  const res = await fetch("/api/chat/media/config", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  
  if (!res.ok) throw new Error("Failed to fetch media config");
  return res.json();
}

export async function uploadFile(
  conversationId: number,
  file: File
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`/api/chat/conversations/${conversationId}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Upload failed");
  }

  return res.json();
}
