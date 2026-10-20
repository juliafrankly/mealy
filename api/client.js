import { API_URL } from "../constants/config";

const REQUEST_TIMEOUT_MS = 10000;

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

    // Give up if the server does not answer, instead of spinning forever
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, REQUEST_TIMEOUT_MS);

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });
    } catch (err) {
        console.error(err);
        throw new ApiError(
            timedOut
                ? "The server took too long to respond. Please try again."
                : "Could not reach the server. Check your connection and try again.",
            0
        );
    } finally {
        clearTimeout(timer);
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