// lib/server/backend.ts
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || 'http://0.0.0.0:8000';

export class BackendError extends Error {
  status: number;
  field?: string;
  
  constructor(message: string, status: number, field?: string) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
    this.field = field;
  }
}

type HttpHeaders = Record<string, string>;

export async function backendFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HttpHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(url, {
    ...options,
    headers: headers as HeadersInit,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    throw new BackendError(
      errorData.message || errorData.detail || 'Erreur serveur',
      response.status,
      errorData.field
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/pdf') || contentType?.includes('text/csv')) {
    return response.blob() as T;
  }

  return response.json();
}

export async function backendFetchFormData<T = any>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HttpHeaders = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(url, {
    ...options,
    method: options.method || 'POST',
    headers: headers as HeadersInit,
    body: formData,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    throw new BackendError(
      errorData.message || errorData.detail || 'Erreur serveur',
      response.status,
      errorData.field
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
