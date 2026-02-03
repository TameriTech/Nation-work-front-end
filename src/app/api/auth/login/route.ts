import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // apiClient retourne déjà le JSON
    const data = await apiClient<{ user: any; access_token: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Vérifie qu'on a bien la réponse
    if (!data || !data.user || !data.access_token) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Pose le token dans un cookie httpOnly
    const response = NextResponse.json({ user: data.user });

    response.cookies.set({
      name: "access_token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    console.log("Login successful:", data);
    return response;
  } catch (error) {
    console.error('Error from /auth/login:', error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
