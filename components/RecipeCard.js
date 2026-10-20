import { Pressable, Text, View, StyleSheet } from "react-native";
import RecipeImage from "./RecipeImage";
import COLORS from "../constants/colors";

export default function RecipeCard({ recipe, onPress }) {
    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Recipe ${recipe.title} by ${recipe.author}`}
        >
            <RecipeImage uri={recipe.image_url} height={140} />
            <View style={styles.content}>
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
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: "hidden",
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
    },
    pressed: { opacity: 0.88 },
    content: { paddingHorizontal: 18, paddingVertical: 16 },
    title: { fontSize: 19, lineHeight: 25, fontWeight: "700", color: COLORS.text, marginBottom: 5 },
    meta: { fontSize: 14, lineHeight: 20, color: COLORS.muted, marginBottom: 9 },
    description: { fontSize: 15, lineHeight: 22, color: COLORS.text },
});