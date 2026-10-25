import {
    ImageBackground,
    Image,
    View,
    Text,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionButton from "../components/ActionButton";

export default function HomeScreen({ navigation }) {
    // The header is hidden on this screen, so keep the content below the status bar
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();

    return (
        <ImageBackground
            source={require("../assets/home-background.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scroll,
                        { paddingTop: Math.max(insets.top + 24, height / 2 - 90) },
                    ]}
                >
                    <View style={styles.content}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                            accessibilityLabel="Mealy logo"
                        />

                        <View style={styles.button}>
                            <ActionButton
                                title="YOUR NEXT MEAL"
                                onPress={() => navigation.navigate("RecipeList")}
                                variant="lightOutline"
                            />
                        </View>

                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.30)" },
    scroll: {
        flexGrow: 1,
        justifyContent: "flex-start",
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    content: { width: "100%", maxWidth: 500, alignSelf: "center", alignItems: "center" },
    logo: { width: 300, height: 180, marginBottom: 0, zIndex: 1 },
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
        marginTop: -12,
        marginBottom: 28,
    },
    button: {
        width: "100%",
        marginTop: 80,
        marginBottom: 12,
        minHeight: 44,
        justifyContent: "center",
    },
});