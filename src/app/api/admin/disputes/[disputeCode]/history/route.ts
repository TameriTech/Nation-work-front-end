import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { disputeCode: string } }
) {
  try {
    const { disputeCode } = await params;

    const data = await backendFetch(`/admin/disputes/${disputeCode}/history`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
