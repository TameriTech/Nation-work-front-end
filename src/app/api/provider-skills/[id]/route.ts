import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";
import { json } from "zod";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = await params; 
    const skillId = Number(id);
    const body = await req.json();
    const data = await backendFetch(`/provider/skills/${skillId}`, {
       method: "PUT",
       body: JSON.stringify(body)
      });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const data = await backendFetch(`/provider/skills/${id}`, { 
      method: "DELETE" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
