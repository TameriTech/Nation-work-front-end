import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const url = category 
      ? `/skills?category=${encodeURIComponent(category)}`
      : "/skills";

    const data = await backendFetch(url);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
