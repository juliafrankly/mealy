import { TextInput, StyleSheet } from "react-native";

// Text input with a consistent style. The label is used both as placeholder and as the accessibility label for screen readers.
export default function FormInput({ label, style, ...props }) {
    return (
        <TextInput
            style={[styles.input, style]}
            placeholder={label}
            placeholderTextColor="#767676"
            accessibilityLabel={label}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
});