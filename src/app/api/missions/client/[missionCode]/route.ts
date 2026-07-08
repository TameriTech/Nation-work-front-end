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
    
    const data = await backendFetch(`/missions/client/${missionCode}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
