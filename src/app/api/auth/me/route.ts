import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get('access_token')?.value || null;
    const data = await apiClient("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
  return NextResponse.json(data);
}