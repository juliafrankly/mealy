import { useCallback, useRef, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getRecipes } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import RecipeCard from "../components/RecipeCard";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";
import EmptyView from "../components/EmptyView";

const EMPTY_MESSAGES = {
    mine: "You haven't created any recipes yet.",
    favorites: "No favorites yet. Open a recipe and tap \"Save to favorites\".",
};

// One screen for both "My recipes" and "Favorites".
// route.params.type decides which one to show.
export default function RecipeCollectionScreen({ route, navigation }) {
    const { type } = route.params;
    const { user } = useAuth();
    const { favoriteIds } = useFavorites();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const hasLoaded = useRef(false);

    // Reloads every time the screen gets focus, so changes made on the
    // details screen (edit, delete, unfavorite) show up when you come back.
    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            async function loadRecipes() {
                if (!hasLoaded.current) setLoading(true);
                setError("");
                try {
                    const data = await getRecipes(
                        type === "mine" ? { userId: user.id } : { ids: favoriteIds }
                    );
                    if (!cancelled) {
                        setRecipes(data);
                        hasLoaded.current = true;
                    }
                } catch (err) {
                    console.error(err);
                    if (!cancelled && !hasLoaded.current) setError(err.message);
                } finally {
                    if (!cancelled) setLoading(false);
                }
            }

            loadRecipes();
            return () => {
                cancelled = true;
            };
        }, [type, user.id, favoriteIds, reloadKey])
    );

    if (loading) return <LoadingView />;
    if (error) {
        return (
            <ErrorView message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <RecipeCard
                        recipe={item}
                        onPress={() =>
                            navigation.navigate("RecipeDetails", { id: item.id })
                        }
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<EmptyView message={EMPTY_MESSAGES[type]} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f7f7f7" },
    list: { padding: 16, flexGrow: 1 },
});