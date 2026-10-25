import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { createRecipe, updateRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { useSuccessModal } from "../context/SuccessModalContext";
import CategoryChips from "../components/CategoryChips";
import ActionButton from "../components/ActionButton";
import COLORS from "../constants/colors";

export default function RecipeFormScreen({ navigation, route }) {
    const { token } = useAuth();
    const showSuccess = useSuccessModal();
    // If a recipe is passed in, the form edits it. Otherwise it creates a new one.
    const existing = route.params?.recipe;
    const editing = Boolean(existing);

    const [title, setTitle] = useState(existing?.title ?? "");
    const [description, setDescription] = useState(existing?.description ?? "");
    const [category, setCategory] = useState(existing?.category || null);
    const [ingredients, setIngredients] = useState(existing?.ingredients ?? "");
    const [instructions, setInstructions] = useState(existing?.instructions ?? "");
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
            if (editing) {
                // Empty strings are sent on purpose so that a cleared
                // description or category is actually cleared on the server.
                await updateRecipe(
                    existing.id,
                    {
                        title: title.trim(),
                        description: description.trim(),
                        category: category ?? "",
                        ingredients: ingredients.trim(),
                        instructions: instructions.trim(),
                    },
                    token
                );
                showSuccess("Recipe updated", "Your changes have been saved.");
                navigation.goBack();
            } else {
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
                showSuccess("Recipe created", "Your recipe has been published.");
                navigation.replace("RecipeDetails", { id: created.id });
            }
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
                <CategoryChips value={category} onChange={setCategory} wrap />

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

                <View style={styles.submitButton}>
                    {submitting ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <ActionButton
                            title={editing ? "Save changes" : "Create recipe"}
                            onPress={handleSubmit}
                        />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.background },
    container: {
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
    },
    label: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        minHeight: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 13,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.surface,
    },
    multiline: { minHeight: 128, textAlignVertical: "top" },
    error: { color: COLORS.danger, lineHeight: 22, marginVertical: 14 },
    submitButton: { marginTop: 16 },
});