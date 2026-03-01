import { NextResponse } from "next/server";
import { backendFetchFormData } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const data = await backendFetchFormData(`/chat/conversations/${id}/upload`, formData);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
