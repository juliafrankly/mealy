import { View, Text, Button, StyleSheet } from "react-native";

export default function ErrorView({ message, onRetry }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text} accessibilityRole="alert">
                {message}
            </Text>
            {onRetry ? <Button title="Try again" onPress={onRetry} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    text: { fontSize: 16, color: "#b00020", textAlign: "center", marginBottom: 16 },
});