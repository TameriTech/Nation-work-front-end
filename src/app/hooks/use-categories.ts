import { useState } from "react";
import { getCategories } from "../services/category.service";

export async function getFormCategories() {
    const data = await getCategories();
    // formate categories to keep only id and name
    return { categories: data.map((cat: any) => ({ id: cat.id, name: cat.name })) };
}