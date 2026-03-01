import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = await params;

    const response = await backendFetch(`/admin/payments/transactions/${transactionId}/invoice`);

    // Si l'API externe retourne un PDF
    if (response instanceof Blob) {
      return new NextResponse(response, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=facture-${transactionId}.pdf`,
        },
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
