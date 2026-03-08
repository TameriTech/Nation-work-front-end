import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    const serviceId = Number(id);
    const data = await backendFetch(`/services/${serviceId}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const serviceId = Number(id);
    const data = await backendFetch(`/services/${serviceId}`, { 
      method: "PUT", 
      body: JSON.stringify(body) 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    const serviceId = parseInt(id);
    await backendFetch(`/services/${serviceId}`, { method: "DELETE" });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
