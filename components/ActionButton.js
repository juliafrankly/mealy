import { Pressable, Text, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

export default function ActionButton({ title, onPress, variant = "primary" }) {
    const secondary = variant === "secondary";
    const danger = variant === "danger";

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                secondary && styles.secondaryButton,
                danger && styles.dangerButton,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            <Text
                style={[
                    styles.label,
                    secondary && styles.secondaryLabel,
                    danger && styles.dangerLabel,
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 52,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 13,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surfaceSoft,
    },
    dangerButton: { backgroundColor: COLORS.danger },
    label: {
        color: COLORS.surface,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "700",
        textAlign: "center",
    },
    secondaryLabel: { color: COLORS.primaryDark },
    dangerLabel: { color: COLORS.surface },
    pressed: { opacity: 0.78 },
});
