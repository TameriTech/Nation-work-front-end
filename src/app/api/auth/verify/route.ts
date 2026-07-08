import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Valider les champs
    if (!body.email || !body.code) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email et code OTP requis',
          code: 'missing_fields'
        },
        { status: 422 }
      );
    }

    const data = await backendFetch<{
      success: boolean;
      message: string;
      data: {
        user: any;
        token: string;
        token_type: string;
        verified_at: string;
      };
    }>("/auth/verify", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Si la vérification réussit, définir le cookie de token
    const response = NextResponse.json(data);

    if (data.success && data.data.token) {
      response.cookies.set({
        name: "access_token",
        value: data.data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      });
    }

    return response;

  } catch (error: any) {
    console.error("Verify error:", error);
    return handleApiError(error);
  }
}