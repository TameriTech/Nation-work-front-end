import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const { disputeId } = await params;

    const data = await backendFetch(`/admin/disputes/${disputeId}/history`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
