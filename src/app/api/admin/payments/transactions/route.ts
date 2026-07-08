import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['status', 'client_id', 'provider_id', 'date_from', 'date_to', 'page', 'per_page', 'search', 'min_amount', 'max_amount'];
    
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    const queryString = params.toString();
    const data = await backendFetch(`/payments/admin/all${queryString ? `?${queryString}` : ''}`);
    
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
