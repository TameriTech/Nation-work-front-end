import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PUT(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = await params;
    const body = await req.json();

    const data = await backendFetch(`/categories/${categoryId}`, {
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
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = await params;

    const data = await backendFetch(`/categories/${categoryId}`, {
      method: 'DELETE',
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
