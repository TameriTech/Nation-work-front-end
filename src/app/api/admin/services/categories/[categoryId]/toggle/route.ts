import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/app/lib/api-client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { categoryId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(`/categories/${categoryId}/toggle`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}
