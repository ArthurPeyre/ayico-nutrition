import * as SecureStore from "expo-secure-store";
import { HttpStatusCode as HSC } from "../utils/HttpStatusCode";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const TOKEN_KEY = "auth_token";

export class ApiError extends Error {
    statusCode?: HSC;
    label?: string;

    constructor(
        message: string,
        options?: { statusCode?: HSC; label?: string },
    ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = options?.statusCode;
        this.label = options?.label;
    }
}

export function setToken(token: string) {
    return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function getToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export function clearToken() {
    return SecureStore.deleteItemAsync(TOKEN_KEY);
}

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

// Types que fetch sait envoyer tels quels (fetch/RN fixe lui-meme le bon
// Content-Type, avec le boundary pour FormData par exemple). Tout le reste
// est considere comme du JSON et serialise automatiquement.
function isRawBody(body: unknown): body is BodyInit {
    return (
        body instanceof FormData ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof URLSearchParams ||
        typeof body === "string"
    );
}

export async function apiFetch<T>(
    path: string,
    { body, headers, ...init }: ApiFetchOptions = {},
): Promise<T> {
    if (!API_URL) {
        throw new ApiError("EXPO_PUBLIC_API_URL non definie");
    }

    const token = await getToken();
    const raw = isRawBody(body);
    const isJson = body !== undefined && !raw;

    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...(isJson ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: isJson ? JSON.stringify(body) : (body as BodyInit | undefined),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => undefined);
        throw new ApiError(
            errorBody?.message ?? `${response.status} ${response.statusText}`,
            {
                statusCode: errorBody?.statusCode ?? response.status,
                label: errorBody?.error,
            },
        );
    }

    if (response.status === HSC.NO_CONTENT) {
        return undefined as T;
    }

    return response.json();
}
