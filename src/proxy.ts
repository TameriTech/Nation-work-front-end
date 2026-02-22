// // middleware.ts
 import { NextRequest, NextResponse } from "next/server";
 import jwt from "jsonwebtoken";

 export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const payload = jwt.decode(token) as { role?: string };

    if (!payload?.role) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const ROLE_ROUTES: Record<string, string[]> = {
      freelancer: ["/dashboard/freelancer"],
      client: ["/dashboard/customer"],
      admin: ["/dashboard/admin", "/dashboard/freelancer", "/dashboard/customer"],
      super_admin: ["/dashboard/admin", "/dashboard/freelancer", "/dashboard/customer"],
      //moderator should have access to all routes, but for clarity, we can list them explicitly
      moderator: [
        "/dashboard/admin/",
        "/dashboard/freelancer",
        "/dashboard/customer"
      ],
    };

    const allowedRoutes = ROLE_ROUTES[payload.role] || [];
    const allowed = allowedRoutes.some((r) =>
      pathname.startsWith(r)
    );

    if (!allowed) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

     return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
 }

export const config = {
  matcher: ["/dashboard/:path*"],
};
