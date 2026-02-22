import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET() {
    const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient("/services/wishlist/list", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data);
}
