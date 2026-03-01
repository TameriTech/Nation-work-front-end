import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const educationId = Number(id);

    const data = await backendFetch(`/users/freelancer/education/${educationId}`, { 
      method: "PUT", 
      body: JSON.stringify(body) 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const educationId = Number(id);

    const data = await backendFetch(`/users/freelancer/education/${educationId}`, { 
      method: "DELETE" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
