import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { freelancerId: string } }
) {
  try {
    const { freelancerId } = await params;
    const data = await backendFetch(`/freelancers/${freelancerId}/candidatures`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
