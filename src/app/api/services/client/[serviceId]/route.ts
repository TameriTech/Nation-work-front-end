import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = await params;
    
    if (!serviceId || isNaN(Number(serviceId))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    const serviceIdNumber = Number(serviceId);
    const data = await backendFetch(`/services/client/${serviceIdNumber}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
