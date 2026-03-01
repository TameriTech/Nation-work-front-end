import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = await backendFetch<{ access_token: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!data?.access_token) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Récupérer les données utilisateur
    const userData = await backendFetch("/auth/me");

    // Créer la réponse avec le cookie
    const response = NextResponse.json({ user: userData });

    response.cookies.set({
      name: "access_token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
