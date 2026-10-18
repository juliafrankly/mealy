import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    StyleSheet,
} from "react-native";

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
    flex: { flex: 1 },
    scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
    content: { width: "100%", maxWidth: 500, alignSelf: "center" },
});