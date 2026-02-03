import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function PUT(
  _: Request,
  { params }: { params: { messageId: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(
    `/chat/messages/${params.messageId}/read`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}
