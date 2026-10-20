import { useEffect, useRef, useState } from "react";
import { View, TextInput, FlatList, StyleSheet } from "react-native";
import { getRecipes } from "../api/recipes";
import CategoryChips from "../components/CategoryChips";
import RecipeCard from "../components/RecipeCard";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";
import EmptyView from "../components/EmptyView";
import COLORS from "../constants/colors";

export default function RecipeListScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    // Set when the list reloads because the screen got focus again.
    // A silent reload keeps the old list visible and never shows a spinner.
    const silentReloadRef = useRef(false);
    const isFirstFocus = useRef(true);

    // Reload the list when the user returns to this screen (e.g. after deleting)
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            if (isFirstFocus.current) {
                isFirstFocus.current = false;
                return;
            }
            silentReloadRef.current = true;
            setReloadKey((k) => k + 1);
        });
        return unsubscribe;
    }, [navigation]);

    // Wait until the user stops typing before calling the API
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        let cancelled = false;
        const silent = silentReloadRef.current;
        silentReloadRef.current = false;

        async function loadRecipes() {
            if (!silent) setLoading(true);
            setError("");
            try {
                const data = await getRecipes({ search: debouncedSearch, category });
                if (!cancelled) setRecipes(data);
            } catch (err) {
                console.error(err);
                // A failed silent reload keeps showing the list we already have
                if (!cancelled && !silent) setError(err.message);
            } finally {
                if (!cancelled && !silent) setLoading(false);
            }
        }

        loadRecipes();
        // Ignore the response if the filters changed before it arrived
        return () => {
            cancelled = true;
        };
    }, [debouncedSearch, category, reloadKey]);

    const isFiltering = Boolean(debouncedSearch || category);

    function renderContent() {
        if (loading) return <LoadingView />;
        if (error) {
            return (
                <ErrorView
                    message={error}
                    onRetry={() => setReloadKey((k) => k + 1)}
                />
            );
        }
        return (
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
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <EmptyView
                        message={
                            isFiltering
                                ? "No recipes found. Try another search."
                                : "No recipes yet."
                        }
                    />
                }
            />
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Search recipes"
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                returnKeyType="search"
                accessibilityLabel="Search recipes by title"
            />

            <CategoryChips value={category} onChange={setCategory} showAll />

            <View style={styles.content}>{renderContent()}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    search: {
        minHeight: 52,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 13,
        fontSize: 16,
        marginHorizontal: 18,
        marginTop: 16,
        marginBottom: 12,
        color: COLORS.text,
    },
    content: { flex: 1 },
    list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, flexGrow: 1 },
});