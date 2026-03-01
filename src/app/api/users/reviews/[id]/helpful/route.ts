import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const data = await backendFetch(`/users/reviews/${id}/helpful`, { 
      method: "POST" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
