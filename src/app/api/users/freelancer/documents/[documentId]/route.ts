import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const data = await backendFetch(`/users/freelancer/verification/documents/${id}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await backendFetch(`/users/freelancer/verification/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await backendFetch(`/categories/${id}`, { method: "DELETE" });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
