import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/app/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { transactionId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const response = await apiClient(`/admin/payments/transactions/${transactionId}/invoice`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}
