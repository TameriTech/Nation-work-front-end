import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['search', 'page', 'per_page'];
    
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    const queryString = params.toString();
    const data = await backendFetch(`/categories/admin${queryString ? `?${queryString}` : ''}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await backendFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
