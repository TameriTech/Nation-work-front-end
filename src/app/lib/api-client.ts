import { cookies } from "next/headers";

export class ApiError extends Error {
  response: Response | null;

  constructor(message: string, response: Response | null = null) {
    super(message);
    this.response = response;
  }
}

const API_BASE_URL = process.env.API_INTERNAL_URL;

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('access_token')?.value || null;
  
  console.log("API Client Request:", { url: API_BASE_URL + endpoint, options, tokenPresent: !!token });

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    console.log("Error from api client: ", res);
    
    // If external API returns validation errors (422) or other errors
    throw {
      status: res.status,
      statusText: res.statusText,
      errors: data?.errors, // field-level validation errors
      message: data?.message || "Server Error",
      raw: data,
    };
  }

  return data;
}
