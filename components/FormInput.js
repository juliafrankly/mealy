import { TextInput, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

// Text input with a consistent style. The label is used both as placeholder and as the accessibility label for screen readers.
export default function FormInput({ label, style, ...props }) {
    return (
        <TextInput
            style={[styles.input, style]}
            placeholder={label}
            placeholderTextColor={COLORS.placeholder}
            accessibilityLabel={label}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        minHeight: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 13,
        fontSize: 16,
        marginBottom: 14,
        color: COLORS.text,
        backgroundColor: COLORS.surface,
    },
});