import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const data = await backendFetch(`/services/${id}/complete`, { 
      method: "POST" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
