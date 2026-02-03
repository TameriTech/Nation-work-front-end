import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient("/chat/conversations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const token = (await cookies()).get('access_token')?.value || null;
  const body = await req.json();

  const data = await apiClient("/chat/conversations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return NextResponse.json(data, { status: 201 });
}
