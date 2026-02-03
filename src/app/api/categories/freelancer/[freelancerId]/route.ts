import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { freelancerId: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(
    `/category/freelancers/${params.freelancerId}/categories`,
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
  { params }: { params: { freelancerId: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  const body = await req.json();

  const data = await apiClient(
    `/category/freelancers/${params.freelancerId}/categories`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  return NextResponse.json(data);
}
