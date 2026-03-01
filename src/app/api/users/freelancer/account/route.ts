import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get('password');

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    await backendFetch(`/users/freelancer/account?password=${encodeURIComponent(password)}`, { 
      method: "DELETE" 
    });

    // Delete cookie after account deletion
    (await cookies()).delete('access_token');

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
