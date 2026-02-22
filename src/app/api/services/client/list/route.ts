import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get('access_token')?.value || null;

  const { searchParams } = req.nextUrl;

  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const page = searchParams.get("page");
  const per_page = searchParams.get("per_page");

  const query = new URLSearchParams();

  if (search) query.append("search", search);
  if (page) query.append("page", page)
  if (per_page) query.append("per_page", per_page);
  if (status) query.append("status", status);


  const data = await apiClient(`/services/client/list?${query.toString()}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data);
}
