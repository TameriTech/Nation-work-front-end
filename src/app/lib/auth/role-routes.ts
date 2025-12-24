import { NextRequest, NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  freelancer: ["/dashboard/freelancer"],
  client: ["/dashboard/customer"],
  admin: ["/dashboard/admin"],
};

export function checkRole(req: NextRequest, user: { role: string }) {
  const pathname = req.nextUrl.pathname;

  const allowed = ROLE_ROUTES[user.role]?.some((r) =>
    pathname.startsWith(r)
  );

  if (!allowed) {
    return {
      redirect: NextResponse.redirect(new URL("/403", req.url)),
    };
  }

  return {};
}
