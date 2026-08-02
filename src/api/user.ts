import { apiFetch } from "./client";

export interface User {
    id: number | null;
    email: string | null;
    name: string | null;
}

export class UserAPI {
    static getMe() {
        return apiFetch<User>("/me");
    }

    static createAccount(user: Omit<User, "id">, password: string) {
        return apiFetch<User>("/user", {
            method: "POST",
            body: {
                ...user,
                password,
            },
        });
    }

    static deleteAccount() {
        return apiFetch<void>("/me", {
            method: "DELETE",
        });
    }
}
