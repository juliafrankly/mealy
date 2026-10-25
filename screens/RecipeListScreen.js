import { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { getRecipes } from "../api/recipes";
import ActionButton from "../components/ActionButton";
import CategoryChips from "../components/CategoryChips";
import SortChips from "../components/SortChips";
import RecipeCard from "../components/RecipeCard";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";
import EmptyView from "../components/EmptyView";
import COLORS from "../constants/colors";

const PAGE_SIZE = 10;

export default function RecipeListScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState(null);
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    // Set when the list reloads because the screen got focus again.
    // A silent reload keeps the old list visible and never shows a spinner.
    const silentReloadRef = useRef(false);
    const isFirstFocus = useRef(true);
    // How many recipes are loaded, so a silent reload can keep all loaded pages
    const loadedCountRef = useRef(0);
    // Changes every time the list starts over, so an old "load more"
    // answer that arrives late can be ignored
    const queryVersionRef = useRef(0);

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

    // Load the first page whenever search, category or sort changes
    useEffect(() => {
        let cancelled = false;
        queryVersionRef.current += 1;
        const silent = silentReloadRef.current;
        silentReloadRef.current = false;
        // A silent reload fetches as many recipes as were already loaded
        const count = silent
            ? Math.max(PAGE_SIZE, loadedCountRef.current)
            : PAGE_SIZE;

        async function loadFirstPage() {
            if (!silent) setLoading(true);
            setError("");
            setLoadMoreError("");
            setLoadingMore(false);
            try {
                // One extra recipe tells us if there is another page
                const data = await getRecipes({
                    search: debouncedSearch,
                    category,
                    sort,
                    limit: count + 1,
                    offset: 0,
                });
                if (cancelled) return;
                const page = data.slice(0, count);
                setRecipes(page);
                loadedCountRef.current = page.length;
                setHasMore(data.length > count);
            } catch (err) {
                console.error(err);
                // A failed silent reload keeps showing the list we already have
                if (!cancelled && !silent) setError(err.message);
            } finally {
                if (!cancelled && !silent) setLoading(false);
            }
        }

        loadFirstPage();
        // Ignore the response if the filters changed before it arrived
        return () => {
            cancelled = true;
        };
    }, [debouncedSearch, category, sort, reloadKey]);

    async function loadMore() {
        if (loadingMore || !hasMore) return;
        const version = queryVersionRef.current;
        setLoadingMore(true);
        setLoadMoreError("");
        try {
            const data = await getRecipes({
                search: debouncedSearch,
                category,
                sort,
                limit: PAGE_SIZE + 1,
                offset: recipes.length,
            });
            // The list started over while we waited, so this answer is outdated
            if (version !== queryVersionRef.current) return;

            const page = data.slice(0, PAGE_SIZE);
            const seen = new Set(recipes.map((recipe) => recipe.id));
            const merged = [...recipes, ...page.filter((recipe) => !seen.has(recipe.id))];
            setRecipes(merged);
            loadedCountRef.current = merged.length;
            setHasMore(data.length > PAGE_SIZE);
        } catch (err) {
            console.error(err);
            if (version === queryVersionRef.current) setLoadMoreError(err.message);
        } finally {
            if (version === queryVersionRef.current) setLoadingMore(false);
        }
    }

    const isFiltering = Boolean(debouncedSearch || category);

    function renderFooter() {
        if (loadingMore) {
            return (
                <ActivityIndicator
                    style={styles.footer}
                    accessibilityLabel="Loading more recipes"
                />
            );
        }
        if (loadMoreError) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerError} accessibilityRole="alert">
                        {loadMoreError}
                    </Text>
                    <ActionButton title="Try again" onPress={loadMore} />
                </View>
            );
        }
        if (hasMore) {
            return (
                <View style={styles.footer}>
                    <ActionButton title="Load more" onPress={loadMore} />
                </View>
            );
        }
        if (recipes.length > 0) {
            return <Text style={styles.footerText}>No more recipes.</Text>;
        }
        return null;
    }

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
                ListFooterComponent={renderFooter()}
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
            <SortChips value={sort} onChange={setSort} />

            <View style={styles.content}>{renderContent()}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    search: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        margin: 16,
        marginBottom: 8,
    },
    content: { flex: 1 },
    list: { padding: 16, flexGrow: 1 },
    footer: { paddingVertical: 16, alignItems: "center" },
    footerError: { color: "#b00020", textAlign: "center", marginBottom: 12 },
    footerText: { textAlign: "center", color: "#666", paddingVertical: 16 },
});