// app/api/auth/password/reset-complete/route.ts

import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError, BackendError } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.token || !body.password  || !body.password_confirmation) {
      throw new BackendError(
        "Email, token et mot de passe requis",
        422,
        {
          email: body.email ? [] : ["L'email est requis"],
          token: body.token ? [] : ["Le token est requis"],
          password: body.password ? [] : ["Le mot de passe est requis"],
          password_confirmation: body.password_confirmation ? [] : ["La confirmation du mot de passe est requise"]
        }
      );
    }

    const data = await backendFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Si la réinitialisation réussit et qu'un token est retourné
    if (data.success && data.data?.token) {
      const response = NextResponse.json(data);
      
      // Définir le cookie de session
      response.cookies.set({
        name: "access_token",
        value: data.data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}