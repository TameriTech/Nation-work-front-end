import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST() {
  try {
    // Appeler le backend pour déconnecter (optionnel)
    await backendFetch("/auth/logout", { method: "POST" }).catch(() => {});

    // Créer la réponse
    const response = NextResponse.json({ message: "Logged out" });

    // Supprimer le cookie
    response.cookies.set({
      name: "access_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
