import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;
    
    if (!serviceId || isNaN(Number(serviceId))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    await backendFetch(`/services/wishlist/${Number(serviceId)}`, { method: "POST" });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;
    
    if (!serviceId || isNaN(Number(serviceId))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
   
    await backendFetch(`/services/wishlist/${Number(serviceId)}`, { method: "DELETE" });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
