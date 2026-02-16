import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/app/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams(searchParams);

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const response = await apiClient(`/admin/payments/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Si l'API externe retourne un CSV
    if (response instanceof Blob) {
      return new NextResponse(response, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=transactions.csv',
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
