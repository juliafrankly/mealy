import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Button,
    Share,
    Alert,
    StyleSheet,
} from "react-native";
import { getRecipe } from "../api/recipes";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

// Ingredients are stored as one text field. Split on new lines or on commas if the text is a single line.
function splitIngredients(text) {
    const separator = text.includes("\n") ? "\n" : ",";
    return text
        .split(separator)
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function RecipeDetailsScreen({ route }) {
    const { id } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadRecipe() {
            setLoading(true);
            setError("");
            try {
                const data = await getRecipe(id);
                if (!cancelled) setRecipe(data);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadRecipe();
        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

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

    if (loading) return <LoadingView />;
    if (error) {
        return <ErrorView message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
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

            <View style={styles.button}>
                <Button title="Share recipe" onPress={handleShare} />
            </View>
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
    button: { marginTop: 32 },
});