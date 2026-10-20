import { View, Text, StyleSheet } from "react-native";
import ActionButton from "./ActionButton";
import COLORS from "../constants/colors";

export default function ErrorView({ message, onRetry }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text} accessibilityRole="alert">
                {message}
            </Text>
            {onRetry ? <ActionButton title="Try again" onPress={onRetry} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 28,
        backgroundColor: COLORS.background,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.danger,
        textAlign: "center",
        marginBottom: 20,
    },
});