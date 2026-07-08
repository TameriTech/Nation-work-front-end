import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = await params;

    const data = await backendFetch(`/categories/${categoryId}/toggle-active`, {
      method: 'PATCH',
    });

    return NextResponse.json(data);

  } catch (error) {
    return handleApiError(error);
  }
}
