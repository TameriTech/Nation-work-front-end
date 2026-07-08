// app/api/admin/skills/[skillId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

// GET /api/admin/skills/[skillId] - Récupérer une compétence par ID
export async function GET(
  req: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const { skillId } = await params;
    const data = await backendFetch(`/skills/${skillId}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/admin/skills/[skillId] - Mettre à jour une compétence
export async function PUT(
  req: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const { skillId } = await params;
    const body = await req.json();
    const data = await backendFetch(`/skills/${skillId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admin/skills/[skillId] - Supprimer une compétence
export async function DELETE(
  req: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const { skillId } = await params;
    const data = await backendFetch(`/skills/${skillId}`, {
      method: "DELETE",
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
