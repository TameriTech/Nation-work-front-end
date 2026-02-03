import { Category, CategoryStats } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  const res = await fetch("/api/categories/stats", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category stats");
  }

  return res.json();
}

export async function getCategoryById(
  categoryId: number
): Promise<Category> {
  const res = await fetch(`/api/categories/${categoryId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  return res.json();
}

export async function createCategory(
  category: Omit<Category, "id" | "created_at" | "updated_at">
): Promise<Category> {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!res.ok) {
    throw new Error("Failed to create category");
  }

  return res.json();
}

export async function updateCategory(
  categoryId: number,
  category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>
): Promise<Category> {
  const res = await fetch(`/api/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!res.ok) {
    throw new Error("Failed to update category");
  }

  return res.json();
}

export async function deleteCategory(
  categoryId: number
): Promise<void> {
  const res = await fetch(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
}

export async function getFreelancerCategories(
  freelancerId: number
): Promise<Category[]> {
  const res = await fetch(
    `/api/categories/freelancer/${freelancerId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch freelancer categories");
  }

  return res.json();
}

export async function setFreelancerCategories(
  freelancerId: number,
  categories: number[]
): Promise<Category[]> {
  const res = await fetch(
    `/api/categories/freelancer/${freelancerId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categories }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to set freelancer categories");
  }

  return res.json();
}
