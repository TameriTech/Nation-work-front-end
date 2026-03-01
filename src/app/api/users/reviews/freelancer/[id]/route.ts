import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = params.id;
    const skip = searchParams.get('skip') || '0';
    const limit = searchParams.get('limit') || '20';

    const data = await backendFetch(`/users/reviews/freelancer/${id}?skip=${skip}&limit=${limit}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
