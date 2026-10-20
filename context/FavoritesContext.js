import { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { getFavoriteIds, addFavorite, removeFavorite } from "../api/favorites";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const { user, token } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState([]);
    // Always holds the latest list, so quick successive taps and
    // rollbacks never work on an outdated copy.
    const idsRef = useRef([]);

    // The server is the source of truth. AsyncStorage keeps a copy per user
    // so favorites show up instantly on app start, before the server answers.
    const storageKey = user ? `favorites:${user.id}` : null;

    function applyIds(next) {
        idsRef.current = next;
        setFavoriteIds(next);
        if (storageKey) {
            AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch((err) =>
                console.error("Could not cache favorites:", err)
            );
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function loadFavorites() {
            idsRef.current = [];
            setFavoriteIds([]);
            if (!storageKey || !token) return;

            // 1. Show the cached favorites right away
            try {
                const stored = await AsyncStorage.getItem(storageKey);
                if (!cancelled && stored) {
                    const cached = JSON.parse(stored);
                    idsRef.current = cached;
                    setFavoriteIds(cached);
                }
            } catch (err) {
                console.error("Could not read cached favorites:", err);
            }

            // 2. Replace them with the real list from the server
            try {
                const ids = await getFavoriteIds(token);
                if (!cancelled) applyIds(ids);
            } catch (err) {
                // If the server can't be reached we keep showing the cached list
                console.error("Could not load favorites:", err);
            }
        }

        loadFavorites();
        return () => {
            cancelled = true;
        };
    }, [storageKey, token]);

    const isFavorite = (recipeId) => favoriteIds.includes(recipeId);

    // Optimistic update: the UI changes first, then the server is told.
    // Returns null on success, or the error if the server call failed
    // (in which case the change has been undone).
    const toggleFavorite = async (recipeId) => {
        if (!token) return null;

        const wasFavorite = idsRef.current.includes(recipeId);

        // 1. Update the UI immediately
        applyIds(
            wasFavorite
                ? idsRef.current.filter((id) => id !== recipeId)
                : [recipeId, ...idsRef.current]
        );

        // 2. Tell the server
        try {
            if (wasFavorite) {
                await removeFavorite(recipeId, token);
            } else {
                await addFavorite(recipeId, token);
            }
            return null;
        } catch (err) {
            console.error("Could not update favorite:", err);
            // 3. The server said no, so undo only this change
            applyIds(
                wasFavorite
                    ? [recipeId, ...idsRef.current.filter((id) => id !== recipeId)]
                    : idsRef.current.filter((id) => id !== recipeId)
            );
            return err;
        }
    };

    return (
        <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);