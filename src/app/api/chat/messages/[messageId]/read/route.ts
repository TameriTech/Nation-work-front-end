import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PUT(
  _: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = await params;
    const data = await backendFetch(`/chat/messages/${messageId}/read`, {
      method: "PUT",
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}