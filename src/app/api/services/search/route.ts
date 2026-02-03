import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    const token = (await cookies()).get('access_token')?.value || null;
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "";

  const data = await apiClient(
    `/services/search?query=${encodeURIComponent(query)}`,
    { method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}
