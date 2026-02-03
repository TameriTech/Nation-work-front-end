import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(
    `/chat/conversations/${params.id}/messages`,
    { 
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const data = await apiClient(
    `/chat/conversations/${params.id}/messages`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  return NextResponse.json(data, { status: 201 });
}
