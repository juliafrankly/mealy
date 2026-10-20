import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { setUnauthorizedHandler } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while we read SecureStore
    // Prevents several failing requests from showing several alerts
    const sessionExpiredRef = useRef(false);

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
        sessionExpiredRef.current = false;
        setToken(newToken);
        setUser(newUser);
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        setToken(null);
        setUser(null);
    };

    // Log the user out automatically when the API rejects the token
    useEffect(() => {
        setUnauthorizedHandler(async () => {
            if (sessionExpiredRef.current) return;
            sessionExpiredRef.current = true;
            try {
                await signOut();
                Alert.alert("Session expired", "Please log in again.");
            } catch (err) {
                console.error("Could not log out after expired session:", err);
            }
        });
        return () => setUnauthorizedHandler(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);