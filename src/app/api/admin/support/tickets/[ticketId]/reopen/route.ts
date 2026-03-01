import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = await params;

    const data = await backendFetch(`/admin/support/tickets/${ticketId}/reopen`, {
      method: 'POST',
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
