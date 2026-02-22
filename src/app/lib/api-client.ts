import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_INTERNAL_URL;

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('access_token')?.value || null;
  
  // Déterminer si on envoie du FormData
  const isFormData = options.body instanceof FormData;
  
  // Construire les headers
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  
  // Ne pas ajouter Content-Type pour FormData (le navigateur le fera avec le boundary)
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Préparer le body
  let body = options.body;
  if (!isFormData && body && typeof body === 'object') {
    body = JSON.stringify(body);
  }
  
  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    body: body as BodyInit,
    cache: options.cache,
    next: options.next,
    signal: options.signal,
  };
  
  // Log pour déboguer
  console.log("API Client Request:", {
    method: fetchOptions.method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: fetchOptions.headers,
    bodyType: isFormData ? 'FormData' : typeof body,
    tokenPresent: !!token
  });

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    let data: any = null;
    const contentType = res.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      console.error("API Error Response:", {
        status: res.status,
        statusText: res.statusText,
        data
      });
      
      throw {
        status: res.status,
        statusText: res.statusText,
        message: data?.message || data || "Server Error",
        raw: data,
      };
    }

    return data;
  } catch (error) {
    console.error("API Client Fetch Error:", error);
    throw error;
  }
}