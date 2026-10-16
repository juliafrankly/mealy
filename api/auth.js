import { apiRequest } from "./client";

export function login(email, password) {
    return apiRequest("/login", { method: "POST", body: { email, password } });
}

export function register(email, username, password) {
    return apiRequest("/register", {
        method: "POST",
        body: { email, username, password },
    });
}