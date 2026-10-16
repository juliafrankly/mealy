import { View, Text, StyleSheet } from "react-native";

export default function EmptyView({ message }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    text: { fontSize: 16, color: "#555", textAlign: "center" },
});