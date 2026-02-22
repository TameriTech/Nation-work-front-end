import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  // Await the params Promise first
  const { id } = await params;
  
  // Then use the id
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
  }
  
  // Rest of your DELETE logic...
  const serviceId = parseInt(id);
  
  const token = (await cookies()).get('access_token')?.value || null;
  const data = await apiClient(`/services/${serviceId}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get('access_token')?.value || null;
  const body = await req.json();

  const {id} = await params;

  const serviceId = Number(id);

  const data = await apiClient(`/services/${serviceId}`, {
    method: "PUT",
    headers: {
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return NextResponse.json(data);
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise first
    const { id } = await params;
    
    // Then use the id
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    // Rest of your DELETE logic...
    const serviceId = parseInt(id);
    
    // Your existing code...
    const token = (await cookies()).get('access_token')?.value || null;
    const response = await apiClient(`/services/${serviceId}`, {
      method: "DELETE",
      headers: {
          Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}