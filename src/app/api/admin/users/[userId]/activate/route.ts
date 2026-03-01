import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    const data = await backendFetch(`/admin/users/${userId}/activate`, {
      method: 'POST',
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
