// // middleware.ts
 import { NextRequest, NextResponse } from "next/server";
 import jwt from "jsonwebtoken";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const payload = jwt.decode(token) as { sub?: string; role?: string };
    
    if (!payload?.sub) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Appeler votre route API avec l'URL de base
    const userCheck = await fetch(`${req.nextUrl.origin}/api/auth/me`, {
      headers: {
        'Cookie': `access_token=${token}`
      }
    });
    
    if (!userCheck.ok) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    const userData = await userCheck.json();
    
    // Vérifier les accès
    const roleRoutes: Record<string, string[]> = {
      freelancer: ["/dashboard/freelancer"],
      client: ["/dashboard/customer"],
      admin: ["/dashboard/admin", "/dashboard/freelancer", "/dashboard/customer"],
      super_admin: ["/dashboard/admin", "/dashboard/freelancer", "/dashboard/customer"],
      moderator: ["/dashboard/admin/", "/dashboard/freelancer", "/dashboard/customer"],
    };

    const allowedRoutes = roleRoutes[userData.role] || [];
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
    
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

// Fallback avec le rôle du token
function verifyWithTokenRole(role: string, pathname: string, req: NextRequest) {
  const ROLE_ROUTES: Record<string, string[]> = {
    freelancer: ["/dashboard/freelancer"],
    client: ["/dashboard/customer"],
    admin: ["/dashboard/admin", "/dashboard/freelancer", "/dashboard/customer"],
    super_admin: ["/dashboard/admin", "/dashboard/freelancer", "/dashboard/customer"],
    moderator: ["/dashboard/admin/", "/dashboard/freelancer", "/dashboard/customer"],
  };

  const allowedRoutes = ROLE_ROUTES[role] || [];
  const allowed = allowedRoutes.some((r) => pathname.startsWith(r));

  if (!allowed) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
