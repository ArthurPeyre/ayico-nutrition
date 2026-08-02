import { apiFetch } from "./client";

export type Health = { status: string };

export class HealthApi {
    static getHealth() {
        return apiFetch<Health>("/health");
    }
}
