import { backendFetch, BackendError } from '@/app/lib/server/backend';
import { handleApiError } from '@/app/lib/server/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const serviceCode = searchParams.get('service_code');

    // Validate required parameters
    if (!username || !serviceCode) {
      return NextResponse.json(
        { 
          success: false,
          detail: 'Missing required parameters: username and service_code are required' 
        },
        { status: 400 }
      );
    }

    // Forward the request to your FastAPI backend
    const backendParams = new URLSearchParams();
    backendParams.append('username', username);
    backendParams.append('service_code', serviceCode);

    // backendFetch retourne déjà les données parsées, pas un objet Response
    const data = await backendFetch(
      `/chat/conversations/by-service?${backendParams.toString()}`,
      { method: 'GET' }
    );

    // Return the data directly
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error in /api/chat/conversations/by-service:', error);
    
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, detail: error.message },
        { status: error.status }
      );
    }
    
    return handleApiError(error);
  }
}
