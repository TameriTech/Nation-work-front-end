// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError, BackendError, createBackendErrorFromResponse } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation manuelle simple
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'password', 'role', 'accepted_terms', 'accepted_privacy'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      const errors: Record<string, string[]> = {};
      missingFields.forEach(field => {
        errors[field] = [`Le champ ${field} est requis`];
      });
      
      throw new BackendError(
        "Champs manquants",
        422,
        errors
      );
    }

    // Validation du rôle
    if (!['client', 'provider'].includes(body.role)) {
      throw new BackendError(
        "Rôle invalide",
        422,
        { role: ["Rôle invalide. Choisissez client ou provider"] }
      );
    }


    try {
      const data = await backendFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
      });

      return NextResponse.json(data, { status: 201 });
      
    } catch (fetchError: any) {
      console.error("Backend fetch error:", fetchError);
      
      // Si l'erreur a un status et un message
      if (fetchError.status) {
        throw new BackendError(
          fetchError.message || "Erreur du backend",
          fetchError.status,
          fetchError.field || fetchError.errors
        );
      }
      
      throw fetchError;
    }

  } catch (error: any) {
    console.error("Signup error:", error);
    return handleApiError(error);
  }
}