import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Récupère le token depuis le cookie httpOnly
    const token = (await cookies()).get("access_token")?.value;

    if (token) {
      // Appelle le backend pour désactiver le token
      await apiClient("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // Supprime le cookie côté serveur
    const response = NextResponse.json({ message: "Logged out" });
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
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
