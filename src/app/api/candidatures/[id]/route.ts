import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await backendFetch(`/candidatures/${id}`, { method: "DELETE" });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}