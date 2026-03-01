import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = new URLSearchParams(searchParams);
    const queryString = params.toString();

    const response = await backendFetch(`/admin/payments/export${queryString ? `?${queryString}` : ''}`);

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
  } catch (error) {
    return handleApiError(error);
  }
}
