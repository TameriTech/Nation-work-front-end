import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/app/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/users/verifications/pending', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}
