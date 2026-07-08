import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  _: Request,
  { params }: { params: { missionCode: string } }
) {
  try {
    const { missionCode } = await params;
    
    if (!missionCode) {
      return NextResponse.json({ error: "Invalid mission code" }, { status: 400 });
    }
    
    const data = await backendFetch(`/missions/${missionCode}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { serviceCode: string } }
) {
  try {
    const { serviceCode } = await params;
    const body = await req.json();
    const data = await backendFetch(`/services/${serviceCode}`, { 
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
  { params }: { params: Promise<{ serviceCode: string }> }
) {
  try {
    const { serviceCode } = await params;
    
    if (!serviceCode) {
      return NextResponse.json({ error: "Invalid service code" }, { status: 400 });
    }
    
    await backendFetch(`/services/${serviceCode}`, { method: "DELETE" });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
