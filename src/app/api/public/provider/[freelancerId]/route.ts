import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";


export async function GET(
  _: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = await params;
    
    if (!providerId || isNaN(Number(providerId))) {
      return NextResponse.json({ error: "Invalid provider ID" }, { status: 400 });
    }
    
    const providerIdNum = Number(providerId);
    const data = await backendFetch(`/provider/${providerIdNum}/public`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}