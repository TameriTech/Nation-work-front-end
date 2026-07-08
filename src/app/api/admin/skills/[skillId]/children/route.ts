// app/api/admin/skills/[skillId]/children/route.ts
import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

// GET /api/admin/skills/[skillId]/children - Récupérer les compétences enfants
export async function GET(
  req: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const { skillId } = params;
    const data = await backendFetch(`/skills/${skillId}/children`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
