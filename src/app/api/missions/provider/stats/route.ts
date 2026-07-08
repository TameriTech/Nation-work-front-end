import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = await params;
    const data = await backendFetch(`/services/provider/list`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
