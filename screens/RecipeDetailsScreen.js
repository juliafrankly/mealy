import { useCallback, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Button,
    Share,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getRecipe, deleteRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";
import RecipeImage from "../components/RecipeImage";

// Ingredients are stored as one text field. Split on new lines or on commas if the text is a single line.
function splitIngredients(text) {
    const separator = text.includes("\n") ? "\n" : ",";
    return text
        .split(separator)
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function RecipeDetailsScreen({ route, navigation }) {
    const { id } = route.params;
    const { token, user } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const hasLoaded = useRef(false);

    // Runs every time the screen gets focus, so the recipe is refreshed
    // when the user comes back from the edit form.
    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            async function loadRecipe() {
                // Only show the spinner the first time. Later refreshes happen silently.
                if (!hasLoaded.current) setLoading(true);
                setError("");
                try {
                    const data = await getRecipe(id);
                    if (!cancelled) {
                        setRecipe(data);
                        hasLoaded.current = true;
                    }
                } catch (err) {
                    console.error(err);
                    if (!cancelled && !hasLoaded.current) setError(err.message);
                } finally {
                    if (!cancelled) setLoading(false);
                }
            }

            loadRecipe();
            return () => {
                cancelled = true;
            };
        }, [id, reloadKey])
    );

    const handleShare = async () => {
        try {
            await Share.share({
                title: recipe.title,
                message: `${recipe.title}\n\nIngredients:\n${splitIngredients(
                    recipe.ingredients
                )
                    .map((item) => `- ${item}`)
                    .join("\n")}\n\nInstructions:\n${recipe.instructions}\n\nShared from Mealy`,
            });
        } catch (err) {
            console.error(err);
            Alert.alert("Could not share", "Something went wrong. Please try again.");
        }
    };

    const handleToggleFavorite = async () => {
        const failure = await toggleFavorite(recipe.id);
        // A 401 is already handled globally (the user is logged out with a message)
        if (failure && failure.status !== 401) {
            Alert.alert("Could not update favorites", failure.message);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteRecipe(id, token);
            Alert.alert("Recipe deleted", "Your recipe has been removed.");
            navigation.goBack();
        } catch (err) {
            console.error(err);
            if (err.status !== 401) Alert.alert("Could not delete", err.message);
            setDeleting(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete recipe",
            "Are you sure you want to delete this recipe? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: confirmDelete },
            ]
        );
    };

    if (loading) return <LoadingView />;
    if (error) {
        return (
            <ErrorView message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        );
    }

    const isOwner = Boolean(token && user && recipe.user_id === user.id);
    const favorite = isFavorite(recipe.id);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <RecipeImage uri={recipe.image_url} height={220} style={styles.image} />
            <Text style={styles.title} accessibilityRole="header">
                {recipe.title}
            </Text>
            <Text style={styles.meta}>
                by {recipe.author}
                {recipe.category ? ` · ${recipe.category}` : ""}
            </Text>

            {recipe.description ? (
                <Text style={styles.description}>{recipe.description}</Text>
            ) : null}

            <Text style={styles.heading} accessibilityRole="header">
                Ingredients
            </Text>
            {splitIngredients(recipe.ingredients).map((item, index) => (
                <Text key={index} style={styles.text}>
                    • {item}
                </Text>
            ))}

            <Text style={styles.heading} accessibilityRole="header">
                Instructions
            </Text>
            <Text style={styles.text}>{recipe.instructions}</Text>

            {token ? (
                <View style={styles.button}>
                    <Button
                        title={favorite ? "Remove from favorites" : "Save to favorites"}
                        onPress={handleToggleFavorite}
                    />
                </View>
            ) : null}

            <View style={styles.button}>
                <Button title="Share recipe" onPress={handleShare} />
            </View>

            {isOwner ? (
                deleting ? (
                    <ActivityIndicator size="large" style={styles.button} />
                ) : (
                    <>
                        <View style={styles.button}>
                            <Button
                                title="Edit recipe"
                                onPress={() => navigation.navigate("RecipeForm", { recipe })}
                            />
                        </View>
                        <View style={styles.button}>
                            <Button title="Delete recipe" color="#b00020" onPress={handleDelete} />
                        </View>
                    </>
                )
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
    meta: { fontSize: 14, color: "#666", marginBottom: 16 },
    description: { fontSize: 16, marginBottom: 8 },
    heading: { fontSize: 20, fontWeight: "bold", marginTop: 24, marginBottom: 8 },
    text: { fontSize: 16, lineHeight: 24, marginBottom: 4 },
    button: { marginTop: 16 },
    image: { borderRadius: 12, marginBottom: 16, overflow: "hidden" },
});