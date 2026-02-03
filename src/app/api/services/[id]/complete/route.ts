import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
    const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(
    `/services/${params.id}/complete`,
    { method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}
