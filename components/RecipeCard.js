import { Pressable, Text, StyleSheet } from "react-native";

export default function RecipeCard({ recipe, onPress }) {
    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Recipe ${recipe.title} by ${recipe.author}`}
        >
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.meta}>
                by {recipe.author}
                {recipe.category ? ` · ${recipe.category}` : ""}
            </Text>
            {recipe.description ? (
                <Text style={styles.description} numberOfLines={2}>
                    {recipe.description}
                </Text>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
    },
    pressed: { opacity: 0.7 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
    meta: { fontSize: 14, color: "#666", marginBottom: 8 },
    description: { fontSize: 15, color: "#333" },
});