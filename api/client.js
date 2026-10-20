import { API_URL } from "../constants/config";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// AuthContext registers a function here that logs the user out
// when the server says the token is no longer valid.
let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
    onUnauthorized = handler;
}

export async function apiRequest(path, { method = "GET", body, token } = {}) {
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (err) {
        console.error(err);
        throw new ApiError(
            "Could not reach the server. Check your connection and try again.",
            0
        );
    }

    if (response.status === 204) return null;

    let data = null;
    try {
        data = await response.json();
    } catch {
        // Response had no JSON body
    }

    if (!response.ok) {
        // Only when a token was sent: a wrong password at login is also a 401,
        // but that should show an error message, not log anyone out.
        if (response.status === 401 && token && onUnauthorized) {
            onUnauthorized();
        }
        throw new ApiError(
            data?.message || "Something went wrong. Please try again.",
            response.status
        );
    }

    return data;
}