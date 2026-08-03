import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { getToken } from "../api/client";
import { AuthAPI } from "../api/auth";
import { User, UserAPI } from "../api/user";

interface AuthContextValue {
    hasToken: boolean | null;
    me: User | { error: string } | undefined;
    login: (email: string, password: string) => Promise<void>;
    createAccount: (
        user: Omit<User, "id">,
        password: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const [me, setMe] = useState<User | { error: string }>();

    const refreshTokenState = useCallback(async () => {
        const token = await getToken();
        setHasToken(!!token);
    }, []);

    const refreshMe = useCallback(async () => {
        try {
            const data = await UserAPI.getMe();
            setMe(data);
        } catch (error: any) {
            setMe({ error: error.message });
        }
    }, []);

    useEffect(() => {
        refreshTokenState();
    }, [refreshTokenState]);

    useEffect(() => {
        if (hasToken) {
            refreshMe();
        } else {
            setMe(undefined);
        }
    }, [hasToken, refreshMe]);

    const login = useCallback(
        async (email: string, password: string) => {
            await AuthAPI.login(email, password);
            await refreshTokenState();
        },
        [refreshTokenState],
    );

    const createAccount = useCallback(
        async (user: Omit<User, "id">, password: string) => {
            await UserAPI.createAccount(user, password);
            await login(user.email ?? "", password);
        },
        [login],
    );

    const logout = useCallback(async () => {
        await AuthAPI.logout();
        await refreshTokenState();
    }, [refreshTokenState]);

    const deleteAccount = useCallback(async () => {
        await UserAPI.deleteAccount();
        await logout();
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{
                hasToken,
                me,
                login,
                createAccount,
                logout,
                deleteAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
