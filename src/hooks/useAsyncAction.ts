import { useCallback, useState } from "react";
import { ApiError } from "../api/client";

// Centralise la gestion d'erreur pour les actions async declenchees par
// l'utilisateur (soumission de formulaire, etc.): plus besoin de repeter le
// try/catch/instanceof ApiError dans chaque ecran.
export function useAsyncAction<Args extends unknown[]>(
    action: (...args: Args) => Promise<void>,
    mapError?: (error: ApiError) => string,
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const run = useCallback(
        async (...args: Args) => {
            setError(undefined);
            setLoading(true);
            try {
                await action(...args);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(mapError?.(err) ?? err.message);
                } else {
                    setError("Une erreur inattendue est survenue");
                }
            } finally {
                setLoading(false);
            }
        },
        [action, mapError],
    );

    return { run, loading, error };
}
