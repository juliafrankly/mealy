import { View, Text, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

export default function EmptyView({ message }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 48,
    },
    text: { fontSize: 16, lineHeight: 24, color: COLORS.muted, textAlign: "center" },
});