import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['status', 'priority', 'opened_by', 'date_from', 'date_to', 'assigned_to', 'page', 'per_page'];
    
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    const queryString = params.toString();
    const endpoint = `/admin/disputes${queryString ? `?${queryString}` : ''}`;

    const data = await backendFetch(endpoint);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
