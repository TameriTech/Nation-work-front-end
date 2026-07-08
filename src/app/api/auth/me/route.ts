// app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { backendFetch } from "@/app/lib/server/backend";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");


    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur depuis le backend
    const userData = await backendFetch("/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
      },
    });
  } catch (error: any) {
    console.error("❌ Me error:", error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: error.status || 500 }
    );
  }
}