import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await backendFetch(`/services/${id}/images`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
