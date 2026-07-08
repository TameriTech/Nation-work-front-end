// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { backendFetch } from "@/app/lib/server/backend";
// app/api/auth/login/route.ts

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const loginData = await backendFetch(`/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!loginData?.data?.token) {
      return NextResponse.json(
        { message: "Erreur: token manquant" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(loginData);
    const cookieStore = await cookies();
    
    cookieStore.set({
      name: "access_token",
      value: loginData.data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
