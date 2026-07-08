import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = await params;

    const data = await backendFetch(`/payments/admin/transactions/${transactionId}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
