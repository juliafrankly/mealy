import { View, ActivityIndicator, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

export default function LoadingView() {
    return (
        <View style={styles.container} accessibilityLabel="Loading">
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: COLORS.background,
    },
});