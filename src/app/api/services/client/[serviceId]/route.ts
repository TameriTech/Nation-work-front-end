import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { serviceId: string } }
) {
  // Await the params Promise first
  const { serviceId } = await params;
  
  // Then use the serviceId
  if (!serviceId || isNaN(Number(serviceId))) {
    return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
  }
  
  // Rest of your DELETE logic...
  const serviceIdNumber = Number(serviceId);
  
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(`/services/client/${serviceIdNumber}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data);
}