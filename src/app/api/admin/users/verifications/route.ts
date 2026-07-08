// app/api/admin/users/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: NextRequest) {
  try {
    // Get the full URL and extract search params
    const { searchParams } = new URL(req.url);
    
    console.log("=== Frontend API Route Debug ===");
    console.log("Full URL:", req.url);
    console.log("All search params:", Object.fromEntries(searchParams.entries()));
    
    // Forward ALL query parameters exactly as received
    const params = new URLSearchParams();
    
    // Forward each parameter
    searchParams.forEach((value, key) => {
      params.append(key, value);
      console.log(`Forwarding: ${key}=${value}`);
    });
    
    const queryString = params.toString();
    // CORRECT BACKEND URL (based on your router prefix)
    const backendUrl = `/admin/users/documents${queryString ? `?${queryString}` : ''}`;
    
    console.log("Backend URL:", backendUrl);
    
    const data = await backendFetch(backendUrl);
    console.log("Response received:", data);
    
    // Return paginated response
    return NextResponse.json({
      items: data.items || [],
      total: data.total || 0,
      page: Math.floor(Number(searchParams.get('skip') || 0) / Number(searchParams.get('limit') || 20)) + 1,
      per_page: Number(searchParams.get('limit') || 20),
      total_pages: Math.ceil((data.total || 0) / Number(searchParams.get('limit') || 20))
    });
  } catch (error) {
    console.error("Frontend API route error:", error);
    return handleApiError(error);
  }
}