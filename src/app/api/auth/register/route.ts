import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fromFrontend = {
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role,
      category_ids: body.category_ids,
      phone_number: body.phone_number,
      username: body.username,
    };

    const data = await backendFetch<{ user: any; access_token: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(fromFrontend),
      }
    );

    const response = NextResponse.json({ user: data.user });

    response.cookies.set({
      name: "access_token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    if (error.status === 422) {
      return NextResponse.json(
        {
          message: error.message,
          errors: error.field,
        },
        { status: 422 }
      );
    }
    return handleApiError(error);
  }
}
