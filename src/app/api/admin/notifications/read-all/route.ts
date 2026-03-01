import { NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST() {
  try {
    const data = await backendFetch('/admin/notifications/read-all', {
      method: 'POST',
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
