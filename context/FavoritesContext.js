import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const { user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState([]);

    // Favorites are stored per user, so two accounts on the same phone don't share a list
    const storageKey = user ? `favorites:${user.id}` : null;

    useEffect(() => {
        let cancelled = false;

        async function loadFavorites() {
            if (!storageKey) {
                setFavoriteIds([]);
                return;
            }
            try {
                const stored = await AsyncStorage.getItem(storageKey);
                if (!cancelled) setFavoriteIds(stored ? JSON.parse(stored) : []);
            } catch (err) {
                console.error("Could not load favorites:", err);
                if (!cancelled) setFavoriteIds([]);
            }
        }

        loadFavorites();
        return () => {
            cancelled = true;
        };
    }, [storageKey]);

    const isFavorite = (recipeId) => favoriteIds.includes(recipeId);

    // Returns true if the change was saved, false if it failed
    const toggleFavorite = async (recipeId) => {
        if (!storageKey) return false;

        const previous = favoriteIds;
        const next = isFavorite(recipeId)
            ? previous.filter((id) => id !== recipeId)
            : [...previous, recipeId];

        setFavoriteIds(next); // update the UI immediately
        try {
            await AsyncStorage.setItem(storageKey, JSON.stringify(next));
            return true;
        } catch (err) {
            console.error("Could not save favorites:", err);
            setFavoriteIds(previous); // roll back if saving failed
            return false;
        }
    };

    return (
        <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);