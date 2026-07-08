import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { serviceCode: string } }
) {
  try {
    const { serviceCode } = await params;
    const data = await backendFetch(`/candidatures/check/${serviceCode}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
