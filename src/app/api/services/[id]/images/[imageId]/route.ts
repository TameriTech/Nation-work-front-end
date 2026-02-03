import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function DELETE(
  _: Request,
  {
    params,
  }: { params: { id: string; imageId: string } }
) {
    const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(
    `/services/${params.id}/images/${params.imageId}`,
    { method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}
