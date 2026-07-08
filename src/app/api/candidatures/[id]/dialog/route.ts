import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const candidatureId = Number(id);
    
    if (isNaN(candidatureId)) {
      return NextResponse.json(
        { message: "Invalid candidature ID" }, 
        { status: 400 }
      );
    }
    
    // backendFetch retourne directement les données (pas besoin de .json())
    const data = await backendFetch(`/candidatures/${candidatureId}/dialog`, { 
      method: "GET" 
    });
    
    // Retourner directement les données reçues
    return NextResponse.json(data);
    
  } catch (error) {
    return handleApiError(error);
  }
}
