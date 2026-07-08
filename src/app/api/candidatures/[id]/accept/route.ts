import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PUT( 
  _: Request,
  { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const candidatureId = Number(id);
    if (isNaN(candidatureId)) {
      return NextResponse.json(
        { message: "Invalid candidature ID" }, 
        { status: 400 }
      );
    }
    const data = await backendFetch(`/candidatures/${candidatureId}/accept`, { 
      method: "PUT",
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
