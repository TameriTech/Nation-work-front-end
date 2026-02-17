import type {
  ReportStats,
  RevenueData,
  ServicesByCategory,
  ServicesByStatus,
  TopFreelancer,
  ActivityData,
  GeographicDistribution,
  PerformanceMetrics,
  ReportFilters,
} from "@/app/types/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || "Une erreur est survenue",
    };
  }
  return response.json();
}

export async function getReportStats(filters?: ReportFilters): Promise<ReportStats> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/stats?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<ReportStats>(response);
}

export async function getRevenueData(
  period: "day" | "week" | "month" | "year" = "month",
  filters?: ReportFilters
): Promise<RevenueData[]> {
  const params = new URLSearchParams({ period });
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/revenue?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<RevenueData[]>(response);
}

export async function getServicesByCategory(filters?: ReportFilters): Promise<ServicesByCategory[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters.category) params.append("category", filters.category);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/services-by-category?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<ServicesByCategory[]>(response);
}

export async function getServicesByStatus(filters?: ReportFilters): Promise<ServicesByStatus[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/services-by-status?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<ServicesByStatus[]>(response);
}

export async function getTopFreelancers(
  limit: number = 10,
  filters?: ReportFilters
): Promise<TopFreelancer[]> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters.category) params.append("category", filters.category);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/top-freelancers?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<TopFreelancer[]>(response);
}

export async function getActivityData(
  period: "day" | "week" | "month" = "day",
  filters?: ReportFilters
): Promise<ActivityData[]> {
  const params = new URLSearchParams({ period });
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/activity?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<ActivityData[]>(response);
}

export async function getGeographicDistribution(filters?: ReportFilters): Promise<GeographicDistribution[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters.city) params.append("city", filters.city);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/geographic?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<GeographicDistribution[]>(response);
}

export async function getPerformanceMetrics(filters?: ReportFilters): Promise<PerformanceMetrics[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/performance?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<PerformanceMetrics[]>(response);
}

export async function exportReport(
  format: "pdf" | "csv" | "excel",
  type: "revenue" | "services" | "freelancers" | "full",
  filters?: ReportFilters
): Promise<Blob> {
  const params = new URLSearchParams({ format, type });
  if (filters) {
    if (filters.dateRange.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters.dateRange.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters.category) params.append("category", filters.category);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/export?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept:
        format === "pdf"
          ? "application/pdf"
          : format === "csv"
          ? "text/csv"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || "Erreur lors de l'export",
    };
  }

  return response.blob();
}