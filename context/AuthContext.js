import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while we read SecureStore

    useEffect(() => {
        async function restoreSession() {
            try {
                const storedToken = await SecureStore.getItemAsync("token");
                const storedUser = await SecureStore.getItemAsync("user");
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.error("Could not restore session:", err);
            } finally {
                setLoading(false);
            }
        }
        restoreSession();
    }, []);

    const signIn = async (newToken, newUser) => {
        await SecureStore.setItemAsync("token", newToken);
        await SecureStore.setItemAsync("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);