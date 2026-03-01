import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const queryParams = new URLSearchParams();
    const params = ['skill', 'city', 'min_rating', 'max_hourly_rate', 'is_available', 'skip', 'limit'];
    
    params.forEach(param => {
      const value = searchParams.get(param);
      if (value) queryParams.append(param, value);
    });

    const url = `/users/client/freelancers/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const data = await backendFetch(url);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
