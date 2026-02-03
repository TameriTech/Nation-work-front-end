import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { serviceId: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(
    `/candidatures/services/${params.serviceId}`,
    { 
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}
