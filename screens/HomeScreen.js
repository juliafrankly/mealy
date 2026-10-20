import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import ScreenContainer from "../components/ScreenContainer";
import ActionButton from "../components/ActionButton";
import COLORS from "../constants/colors";

export default function HomeScreen({ navigation }) {
    const { token } = useAuth();

    return (
        <ScreenContainer>
            <Text style={styles.title} accessibilityRole="header">
                Welcome to Mealy
            </Text>
            <Text style={styles.text}>
                Discover, save and share your favorite recipes.
            </Text>

            <View style={styles.button}>
                <ActionButton
                    title="Browse recipes"
                    onPress={() => navigation.navigate("RecipeList")}
                />
            </View>

            {token ? (
                <>
                    <View style={styles.button}>
                        <ActionButton
                            title="Create recipe"
                            onPress={() => navigation.navigate("RecipeForm")}
                        />
                    </View>
                    <View style={styles.button}>
                        <ActionButton
                            title="My profile"
                            onPress={() => navigation.navigate("Profile")}
                            variant="secondary"
                        />
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.button}>
                        <ActionButton
                            title="Log in"
                            onPress={() => navigation.navigate("Login")}
                            variant="secondary"
                        />
                    </View>
                    <View style={styles.button}>
                        <ActionButton
                            title="Register"
                            onPress={() => navigation.navigate("Register")}
                            variant="secondary"
                        />
                    </View>
                </>
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        lineHeight: 39,
        fontWeight: "800",
        color: COLORS.primaryDark,
        marginBottom: 12,
    },
    text: { fontSize: 17, lineHeight: 25, color: COLORS.muted, marginBottom: 28 },
    button: { marginBottom: 12, minHeight: 44, justifyContent: "center" },
});