import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { log } from "console";

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
    if (!data ||!data.access_token) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // get authenticated user data
    const res = await apiClient("/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    if (!res) {
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    // Pose le token dans un cookie httpOnly
    const response = NextResponse.json({ user: res });

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
    
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
