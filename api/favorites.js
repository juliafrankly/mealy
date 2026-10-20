import { apiRequest } from "./client";

export function getFavoriteIds(token) {
    return apiRequest("/favorites", { token });
}

export function addFavorite(recipeId, token) {
    return apiRequest(`/recipes/${recipeId}/favorite`, { method: "PUT", token });
}

export function removeFavorite(recipeId, token) {
    return apiRequest(`/recipes/${recipeId}/favorite`, { method: "DELETE", token });
}