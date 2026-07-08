import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = await params;
    const data = await backendFetch(`/category/providers/${providerId}/categories`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = await params;
    const body = await req.json();
    const data = await backendFetch(`/category/providers/${providerId}/categories`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
