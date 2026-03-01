import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const include_read = searchParams.get('include_read') === 'true';

    const data = await backendFetch(`/admin/notifications?include_read=${include_read}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
