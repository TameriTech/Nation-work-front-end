// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

    // 1. Login - pas de token
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const loginData = await loginResponse.json();
    console.log('📦 Login data:', loginData);

    if (!loginResponse.ok) {
      return NextResponse.json(
        { message: loginData.message || loginData.detail || 'Erreur' },
        { status: loginResponse.status }
      );
    }

    // 2. Récupérer les infos utilisateur - AVEC le token
    const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });
    
    const userData = await userResponse.json();
    console.log('👤 User data:', userData);

    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "Erreur lors de la récupération du profil" },
        { status: 500 }
      );
    }

    // 3. Créer la réponse avec le cookie
    const response = NextResponse.json({ user: userData });

    response.cookies.set({
      name: "access_token",
      value: loginData.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
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
