import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = params.id;
    const response = searchParams.get('response');

    if (!response) {
      return NextResponse.json(
        { error: "Response is required" },
        { status: 400 }
      );
    }

    const data = await backendFetch(`/users/reviews/${id}/respond?response=${encodeURIComponent(response)}`, { 
      method: "POST" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
