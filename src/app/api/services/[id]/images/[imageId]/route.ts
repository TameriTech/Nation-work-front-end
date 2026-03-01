import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function DELETE(
  _: Request,
  {
    params,
  }: { params: { id: string; imageId: string } }
) {
  try {
    const { id, imageId } = await params;
    const data = await backendFetch(`/services/${id}/images/${imageId}`, { 
      method: "DELETE" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
