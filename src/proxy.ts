// middleware.ts

import { NextRequest, NextResponse } from "next/server";

// Routes publiques
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/user-agreement",
];

// 🔥 ROUTES API PUBLIQUES
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify",
  "/api/auth/resend-verification",
  "/api/auth/password/reset-request",
  "/api/auth/password/verify",
  "/api/auth/password/reset-complete",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  
  // 🔥 Vérifier si c'est une route API publique
  const isPublicApiRoute = PUBLIC_API_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isPublicApiRoute) {
    return NextResponse.next();
  }
  
  // Vérifier si c'est une route publique
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // 🔥 Vérifier si c'est une route API
  const isApiRoute = pathname.startsWith("/api/");
  
  // Vérifier le token
  const token = request.cookies.get("access_token")?.value;
  
  
  if (!token) {
    
    if (isApiRoute) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Non authentifié",
          code: "unauthenticated" 
        },
        { status: 401 }
      );
    }
    
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};