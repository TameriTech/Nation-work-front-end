import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = await params;

    const data = await backendFetch(`/admin/services/${serviceId}/delete`, {
      method: 'DELETE',
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
