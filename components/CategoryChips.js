import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { CATEGORIES } from "../constants/categories";
import COLORS from "../constants/colors";

// Category picker used by both the recipe list (filter) and the recipe form.
// - showAll: adds an "All" chip that selects nothing (filter mode)
// - wrap: chips wrap onto several rows instead of scrolling sideways (form mode)
export default function CategoryChips({ value, onChange, showAll = false, wrap = false }) {
    const items = showAll ? [null, ...CATEGORIES] : CATEGORIES;

    const handlePress = (item) => {
        // In the form, tapping the selected category again clears it
        onChange(!showAll && item === value ? null : item);
    };

    const chips = items.map((item) => {
        const selected = item === value;
        return (
            <Pressable
                key={item ?? "all"}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => handlePress(item)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Category ${item ?? "All"}`}
            >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {item ?? "All"}
                </Text>
            </Pressable>
        );
    });

    if (wrap) return <View style={styles.wrap}>{chips}</View>;

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                {chips}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { paddingHorizontal: 18, paddingBottom: 12 },
    wrap: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { fontSize: 14, fontWeight: "600", color: COLORS.text },
    chipTextSelected: { color: COLORS.surface },
});