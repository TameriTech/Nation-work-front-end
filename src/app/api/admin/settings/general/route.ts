import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET() {
  try {
    const data = await backendFetch('/admin/settings/general');
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await backendFetch('/admin/settings/general', {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
