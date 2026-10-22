import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

const OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "title_asc", label: "A to Z" },
    { value: "title_desc", label: "Z to A" },
];

export default function SortChips({ value, onChange }) {
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                <Text style={styles.label}>Sort by</Text>
                {OPTIONS.map((option) => {
                    const selected = option.value === value;
                    return (
                        <Pressable
                            key={option.value}
                            style={styles.chipButton}
                            onPress={() => onChange(option.value)}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            accessibilityLabel={`Sort by ${option.label}`}
                        >
                            <View
                                style={[styles.chip, selected && styles.chipSelected]}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        selected && styles.chipTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { paddingHorizontal: 16, paddingBottom: 8, alignItems: "center" },
    label: { fontSize: 14, color: COLORS.muted, marginRight: 10, marginBottom: 8 },
    chipButton: { minHeight: 44, justifyContent: "center", marginRight: 8 },
    chip: {
        justifyContent: "center",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 8,
    },
    chipSelected: { backgroundColor: COLORS.surfaceSoft, borderColor: COLORS.primary },
    chipText: { fontSize: 14, color: COLORS.muted },
    chipTextSelected: { color: COLORS.primaryDark, fontWeight: "700" },
});