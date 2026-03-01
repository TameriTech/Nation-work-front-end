import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = await params;
    const body = await req.json();

    const data = await backendFetch(`/categories/${categoryId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
