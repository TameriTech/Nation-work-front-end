import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const page = searchParams.get("page");
    const per_page = searchParams.get("per_page");
    console.log("🔍 Headers reçus:", req.headers.get('authorization'));
    const query = new URLSearchParams();

    if (search) query.append("search", search);
    if (page) query.append("page", page);
    if (per_page) query.append("per_page", per_page);
    if (status) query.append("status", status);

    const data = await backendFetch(`/services/client/list?${query.toString()}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
