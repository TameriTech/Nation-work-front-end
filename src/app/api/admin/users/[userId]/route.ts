import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    const data = await backendFetch(`/admin/users/${userId}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get('permanent') === 'true';

    const data = await backendFetch(`/admin/users/${userId}?permanent=${permanent}`, {
      method: 'DELETE',
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
