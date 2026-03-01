import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { freelancerId: string } }
) {
  try {
    const { freelancerId } = await params;
    const data = await backendFetch(`/category/freelancers/${freelancerId}/categories`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { freelancerId: string } }
) {
  try {
    const { freelancerId } = await params;
    const body = await req.json();
    const data = await backendFetch(`/category/freelancers/${freelancerId}/categories`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
