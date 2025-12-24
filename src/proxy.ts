import { NextRequest, NextResponse } from "next/server";

const PUBLIC_EXACT_ROUTES = ["/", "/auth/login", "/auth/register"];
const PUBLIC_PREFIX_ROUTES = ["/auth"];

const ROLE_ROUTES: Record<string, string[]> = {
  freelancer: ["/dashboard/freelancer"],
  client: ["/dashboard/customer"],
  admin: ["/dashboard/admin"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute =
  PUBLIC_EXACT_ROUTES.includes(pathname) ||
  PUBLIC_PREFIX_ROUTES.some((prefix) => pathname.startsWith(prefix));

  // 1️⃣ Public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2️⃣ Cookie
  const token = req.cookies.get("access_token")?.value;
  

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 3️⃣ Verify token with backend
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }  

  const user = await res.json();

  // 4️⃣ Role check
  const allowedRoutes = ROLE_ROUTES[user.role] || [];
  const allowed = allowedRoutes.some((r) =>
    pathname.startsWith(r)
  );

  if (!allowed) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
