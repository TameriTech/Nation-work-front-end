import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    const serviceId = parseInt(id);
    await backendFetch(`/services/wishlist/${serviceId}`, { method: "POST" });
    return NextResponse.json({ status: 204 });
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
    await backendFetch(`/services/wishlist/${serviceId}`, { method: "DELETE" });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
