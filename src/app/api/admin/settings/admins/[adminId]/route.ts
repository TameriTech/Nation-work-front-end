import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PUT(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    const { adminId } = await params;
    const body = await req.json();

    const data = await backendFetch(`/admin/settings/admins/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    const { adminId } = await params;

    const data = await backendFetch(`/admin/settings/admins/${adminId}`, {
      method: 'DELETE',
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
