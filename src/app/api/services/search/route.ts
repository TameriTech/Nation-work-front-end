import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const query = searchParams.get("search") || searchParams.get("query") || "";
    const category_id = searchParams.get("category_id");
    const min_price = searchParams.get("min_price");
    const max_price = searchParams.get("max_price");
    const location = searchParams.get("location");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const params = new URLSearchParams();
    
    if (query) params.append("query", query);
    if (category_id) params.append("category_id", category_id);
    if (min_price) params.append("min_price", min_price);
    if (max_price) params.append("max_price", max_price);
    if (location) params.append("location", location);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    const url = `/services/search?${params.toString()}`;
    console.log("Calling backend with params:", Object.fromEntries(params));

    const data = await backendFetch(url);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
