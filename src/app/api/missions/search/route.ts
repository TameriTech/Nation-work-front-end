import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("search") || searchParams.get("query") || "";
    const category_id = searchParams.get("category_id");
    const payment_type = searchParams.get("payment_type");
    const location_type = searchParams.get("location_type");
    const city = searchParams.get("city");

    // Date filters
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");

    // Budget filters
    const budget_min = searchParams.get("budget_min");
    const budget_max = searchParams.get("budget_max");
    
    // Status filters
    const is_urgent = searchParams.get("is_urgent");
    const is_featured = searchParams.get("is_featured");

    // Pagination
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "20";

    // Sorting
    const sort_by = searchParams.get("sort_by") || "created_at";
    const sort_order = searchParams.get("sort_order") || "desc";

    // Location-based search
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");

    const params = new URLSearchParams();
    
    if (query) params.append("query", query);
    if (category_id) params.append("category_id", category_id);
    if (payment_type) params.append("payment_type", payment_type);
    if (location_type) params.append("location_type", location_type);
    if (date_from) params.append("date_from", date_from);
    if (date_to) params.append("date_to", date_to);
    if (budget_min) params.append("budget_min", budget_min);
    if (budget_max) params.append("budget_max", budget_max);
    if (is_urgent) params.append("is_urgent", is_urgent);
    if (is_featured) params.append("is_featured", is_featured);
    params.append("page", page);
    params.append("per_page", per_page);
    params.append("sort_by", sort_by);
    params.append("sort_order", sort_order);
    if (city) params.append("city", city);
    if (lat) params.append("lat", lat);
    if (lng) params.append("lng", lng);
    if (radius) params.append("radius", radius);

    const url = `/services/search?${params.toString()}`;
    console.log("Calling backend with params:", Object.fromEntries(params));

    const data = await backendFetch(url);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
