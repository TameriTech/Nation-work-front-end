import { apiClient } from "@/app/lib/api-client";
import { NextResponse } from "next/server";

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

    const data = await apiClient<{ user: any; access_token: string }>(
      "/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    console.error("Failed to register user:", error);
    if (error.status === 422) {
      return NextResponse.json(
        {
          message: error.message,
          errors: error.errors,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
