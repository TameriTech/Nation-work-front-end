import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/app/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(`/admin/disputes/${disputeId}/escalate`, {
      method: 'POST',
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
