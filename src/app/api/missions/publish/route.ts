import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

// Helper to parse duration string like "4h" -> { value: 4, unit: "hours" }
function parseDuration(durationStr: string): { value: number; unit: string } | null {
  const match = durationStr.match(/^(\d+)([a-zA-Z]+)$/);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unitAbbr = match[2].toLowerCase();

  const unitMap: Record<string, string> = {
    'm': 'minutes', 'min': 'minutes', 'mins': 'minutes', 'minute': 'minutes', 'minutes': 'minutes',
    'h': 'hours', 'hr': 'hours', 'hrs': 'hours', 'hour': 'hours', 'hours': 'hours',
    'd': 'days', 'day': 'days', 'days': 'days',
    'w': 'weeks', 'week': 'weeks', 'weeks': 'weeks',
    'mo': 'months', 'mon': 'months', 'month': 'months', 'months': 'months',
  };

  const unit = unitMap[unitAbbr];
  if (!unit) return null;

  return { value, unit };
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log("Received form data:", formData);

    // Fields that the backend expects (excluding the raw 'duration' string)
    const modelFields = [
      "title",
      "service_type",
      "category_id",
      "short_description",
      "full_description",
      "date_pratique",
      "start_time",
      // "duration",  ← removed, we will handle it separately
      "location",
      "mission_type",
      "scheduled_date",
      "duration_value",    // will be set from parsed duration
      "duration_unit",      // will be set from parsed duration
      "duration_days",
      "proposed_amount",
      "accepted_amount",
      "required_skills",
      "preferred_skills",
      "payment_type",
      "is_urgent",
      "is_featured",
      "tags"
    ];

    const cleanData: any = {};

    // Copy allowed fields as-is
    modelFields.forEach(field => {
      if (formData[field] !== undefined) {
        cleanData[field] = formData[field];
      }
    });

    // Handle duration parsing
    if (formData.duration) {
      const parsed = parseDuration(formData.duration);
      if (!parsed) {
        return NextResponse.json(
          { error: "Invalid duration format. Use e.g., '4h', '2d', '30min'." },
          { status: 400 }
        );
      }
      cleanData.duration_value = parsed.value;
      cleanData.duration_unit = parsed.unit;
      // duration_days can remain undefined (not needed for hourly missions)
    } else {
      // If duration is required, return error; adjust according to your business logic
      return NextResponse.json(
        { error: "Duration is required" },
        { status: 400 }
      );
    }

    console.log("Cleaned data to send to backend:", cleanData);

    const response = await backendFetch("/services/publish", {
      method: "POST",
      body: JSON.stringify(cleanData)
    });

    return NextResponse.json(response);

  } catch (error) {
    return handleApiError(error);
  }
}
