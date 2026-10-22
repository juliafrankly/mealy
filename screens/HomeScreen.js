import {
    ImageBackground,
    Image,
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import ActionButton from "../components/ActionButton";

export default function HomeScreen({ navigation }) {
    const { token } = useAuth();
    // The header is hidden on this screen, so keep the content below the status bar
    const insets = useSafeAreaInsets();

    return (
        <ImageBackground
            source={require("../assets/home-background.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            {/* Dark layer so the white text is readable on any photo */}
            <View style={styles.overlay}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scroll,
                        { paddingTop: insets.top + 24 },
                    ]}
                >
                    <View style={styles.content}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                            accessibilityLabel="Mealy logo"
                        />
                        <Text style={styles.text}>
                            Discover, save and share your favorite recipes.
                        </Text>

                        <View style={styles.button}>
                            <ActionButton
                                title="Browse recipes"
                                onPress={() => navigation.navigate("RecipeList")}
                            />
                        </View>

                        {!token ? (
                            <View style={styles.row}>
                                <Pressable
                                    style={styles.outlineButton}
                                    onPress={() => navigation.navigate("Login")}
                                    accessibilityRole="button"
                                    accessibilityLabel="Log in"
                                >
                                    <Text style={styles.outlineText}>Log in</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.outlineButton}
                                    onPress={() => navigation.navigate("Register")}
                                    accessibilityRole="button"
                                    accessibilityLabel="Register"
                                >
                                    <Text style={styles.outlineText}>Register</Text>
                                </Pressable>
                            </View>
                        ) : null}
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.30)" },
    scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
    content: { width: "100%", maxWidth: 500, alignSelf: "center", alignItems: "center" },
    logo: { width: 300, height: 180, marginBottom: 16 },
    title: {
        fontSize: 32,
        lineHeight: 39,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        marginBottom: 12,
    },
    text: {
        fontSize: 17,
        lineHeight: 25,
        color: "#f0f0f0",
        textAlign: "center",
        marginBottom: 28,
    },
    button: { width: "100%", marginBottom: 12, minHeight: 44, justifyContent: "center" },
    row: { flexDirection: "row", width: "100%", marginTop: 4 },
    outlineButton: {
        flex: 1,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 6,
        paddingVertical: 10,
    },
    outlineText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});