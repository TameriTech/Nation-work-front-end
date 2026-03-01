import { NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET() {
  try {
    const data = await backendFetch('/admin/dashboard/charts');
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
