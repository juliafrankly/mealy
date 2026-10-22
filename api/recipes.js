import { apiRequest } from "./client";

export function getRecipes({ search, category, userId, ids, sort, limit, offset } = {}) {
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (userId) params.push(`user_id=${userId}`);
    if (ids) params.push(`ids=${ids.join(",")}`);
    if (sort) params.push(`sort=${encodeURIComponent(sort)}`);
    if (limit) params.push(`limit=${limit}`);
    if (offset) params.push(`offset=${offset}`);
    const query = params.length ? `?${params.join("&")}` : "";

    return apiRequest(`/recipes${query}`);
}

export function getRecipe(id) {
    return apiRequest(`/recipes/${id}`);
}

export function createRecipe(recipe, token) {
    return apiRequest("/recipes", { method: "POST", body: recipe, token });
}

export function updateRecipe(id, changes, token) {
    return apiRequest(`/recipes/${id}`, { method: "PATCH", body: changes, token });
}

export function deleteRecipe(id, token) {
    return apiRequest(`/recipes/${id}`, { method: "DELETE", token });
}