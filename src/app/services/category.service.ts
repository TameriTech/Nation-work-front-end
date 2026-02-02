import { apiClient } from "../lib/api-client";

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryStats {
    name: string,
    description: string,
    icon: string,
    color: string,
    id: number,
    is_active: boolean,
    total_services: number,
    total_freelancers: number,
    average_price: number,
    created_at: string,
    updated_at: string
}

export function getCategories() {
  return apiClient<Category[]>("/categories/", {
    method: "GET",
  });
}

export function getCategoryStats() {
  return apiClient<CategoryStats[]>("/categories/stats", {
    method: "GET",
  });
}

export function getCategoryById(categoryId: number) {
  return apiClient<Category>(`/categories/${categoryId}`, {
    method: "GET",
  });
}

export function createCategory(category: Omit<Category, "id" | "created_at" | "updated_at">) {
  return apiClient<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

export function setFreelancerCategories(freelancerId: number, categories: number[]) {
  return apiClient<Category[]>(`/category/freelancers/${freelancerId}/categories`, {
    method: "POST",
    body: JSON.stringify({ categories }),
  });
}

export function getFreelancerCategories(freelancerId: number) {
  return apiClient<Category[]>(`/category/freelancers/${freelancerId}/categories`, {
    method: "GET",
  });
}

export function updateCategory(categoryId: number, category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>) {
  return apiClient<Category>(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
}

export function deleteCategory(categoryId: number) {
  return apiClient<void>(`/categories/${categoryId}`, {
    method: "DELETE",
  });
}
