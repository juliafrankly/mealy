import { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    ScrollView,
    Pressable,
    StyleSheet,
} from "react-native";
import { getRecipes } from "../api/recipes";
import { CATEGORIES } from "../constants/categories";
import RecipeCard from "../components/RecipeCard";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";
import EmptyView from "../components/EmptyView";

export default function RecipeListScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    // Reload the list when the user returns to this screen (e.g. after deleting)
    const isFirstFocus = useRef(true);
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            if (isFirstFocus.current) {
                isFirstFocus.current = false;
                return;
            }
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

        async function loadRecipes() {
            setLoading(true);
            setError("");
            try {
                const data = await getRecipes({ search: debouncedSearch, category });
                if (!cancelled) setRecipes(data);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
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

            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chips}
                >
                    {[null, ...CATEGORIES].map((item) => {
                        const selected = item === category;
                        return (
                            <Pressable
                                key={item ?? "all"}
                                style={[styles.chip, selected && styles.chipSelected]}
                                onPress={() => setCategory(item)}
                                accessibilityRole="button"
                                accessibilityState={{ selected }}
                                accessibilityLabel={`Category ${item ?? "All"}`}
                            >
                                <Text
                                    style={[styles.chipText, selected && styles.chipTextSelected]}
                                >
                                    {item ?? "All"}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.content}>{renderContent()}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f7f7f7" },
    search: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        margin: 16,
        marginBottom: 8,
    },
    chips: { paddingHorizontal: 16, paddingBottom: 8 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
    },
    chipSelected: { backgroundColor: "#222", borderColor: "#222" },
    chipText: { fontSize: 14, color: "#222" },
    chipTextSelected: { color: "#fff" },
    content: { flex: 1 },
    list: { padding: 16, flexGrow: 1 },
});