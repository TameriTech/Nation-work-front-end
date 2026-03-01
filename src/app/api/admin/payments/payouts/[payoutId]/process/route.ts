import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: { payoutId: string } }
) {
  try {
    const { payoutId } = await params;
    const body = await req.json();

    const data = await backendFetch(`/admin/payments/payouts/${payoutId}/process`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
