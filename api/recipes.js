import { apiRequest } from "./client";

export function getRecipes({ search, category } = {}) {
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    const query = params.length ? `?${params.join("&")}` : "";

    return apiRequest(`/recipes${query}`);
}

export function getRecipe(id) {
    return apiRequest(`/recipes/${id}`);
}

export function createRecipe(recipe, token) {
    return apiRequest("/recipes", { method: "POST", body: recipe, token });
}