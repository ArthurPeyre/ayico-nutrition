export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {}

export async function apiFetch<T>(
    path: string,
    init?: RequestInit,
): Promise<T> {
    if (!API_URL) {
        throw new ApiError("EXPO_PUBLIC_API_URL non definie");
    }

    const response = await fetch(`${API_URL}${path}`, init);
    if (!response.ok) {
        throw new ApiError(`${response.status} ${response.statusText}`);
    }

    return response.json();
}
