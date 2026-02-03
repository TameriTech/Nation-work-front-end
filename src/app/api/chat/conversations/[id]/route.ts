import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(
    `/chat/conversations/${params.id}`,
    { 
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  await apiClient(`/chat/conversations/${params.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(null, { status: 204 });
}