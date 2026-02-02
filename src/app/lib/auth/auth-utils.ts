import { NextRequest, NextResponse } from "next/server";

export async function checkAuth(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return {
      redirect: NextResponse.redirect(new URL("/auth/login", req.url)),
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return {
      redirect: NextResponse.redirect(new URL("/auth/login", req.url)),
    };
  }
    
    console.log(res);
    

  const user = await res.json();

  const response = NextResponse.next();
  response.headers.set("x-user-role", user.role);

  return { user, response };
}
