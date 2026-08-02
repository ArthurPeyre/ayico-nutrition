import { apiFetch, clearToken, setToken } from "./client";

interface LoginResponse {
    token: string;
}

export class AuthAPI {
    static async login(email: string, password: string) {
        const { token } = await apiFetch<LoginResponse>("/login", {
            method: "POST",
            body: { email, password },
        });
        await setToken(token);
    }

    static logout() {
        return clearToken();
    }
}
