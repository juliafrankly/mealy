import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { createRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../constants/categories";

export default function RecipeFormScreen({ navigation }) {
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(null);
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
            setError("Title, ingredients and instructions are required.");
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            const created = await createRecipe(
                {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    category: category || undefined,
                    ingredients: ingredients.trim(),
                    instructions: instructions.trim(),
                },
                token
            );
            Alert.alert("Recipe created", "Your recipe has been published.");
            navigation.replace("RecipeDetails", { id: created.id });
        } catch (err) {
            console.error(err);
            setError(err.message);
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Title *</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Spaghetti Carbonara"
                    accessibilityLabel="Title"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="A short description"
                    accessibilityLabel="Description"
                />

                <Text style={styles.label}>Category</Text>
                <View style={styles.chips}>
                    {CATEGORIES.map((item) => {
                        const selected = item === category;
                        return (
                            <Pressable
                                key={item}
                                style={[styles.chip, selected && styles.chipSelected]}
                                // Tap the selected category again to clear it
                                onPress={() => setCategory(selected ? null : item)}
                                accessibilityRole="button"
                                accessibilityState={{ selected }}
                                accessibilityLabel={`Category ${item}`}
                            >
                                <Text
                                    style={[styles.chipText, selected && styles.chipTextSelected]}
                                >
                                    {item}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Text style={styles.label}>Ingredients * (one per line)</Text>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    value={ingredients}
                    onChangeText={setIngredients}
                    placeholder={"200g spaghetti\n2 eggs\n100g pancetta"}
                    multiline
                    accessibilityLabel="Ingredients, one per line"
                />

                <Text style={styles.label}>Instructions *</Text>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    value={instructions}
                    onChangeText={setInstructions}
                    placeholder="Describe how to make the recipe"
                    multiline
                    accessibilityLabel="Instructions"
                />

                {error ? (
                    <Text style={styles.error} accessibilityRole="alert">
                        {error}
                    </Text>
                ) : null}

                {submitting ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <Button title="Create recipe" onPress={handleSubmit} />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { padding: 24, paddingBottom: 48 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    multiline: { minHeight: 120, textAlignVertical: "top" },
    chips: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelected: { backgroundColor: "#222", borderColor: "#222" },
    chipText: { fontSize: 14, color: "#222" },
    chipTextSelected: { color: "#fff" },
    error: { color: "#b00020", marginVertical: 12 },
});