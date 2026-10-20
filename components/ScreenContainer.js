import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    StyleSheet,
} from "react-native";
import COLORS from "../constants/colors";

// Scrollable, keyboard-aware container. Content is centered when it fits on the screen and scrolls when it doesn't.
// On wide screens the content stays at a readable width.
export default function ScreenContainer({ children }) {
    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>{children}</View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.background },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 22,
        paddingVertical: 28,
    },
    content: {
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 18,
        elevation: 3,
    },
});