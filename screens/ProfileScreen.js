import { View, Text, Alert, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSuccessModal } from "../context/SuccessModalContext";
import ScreenContainer from "../components/ScreenContainer";
import ActionButton from "../components/ActionButton";
import COLORS from "../constants/colors";

export default function ProfileScreen({ navigation }) {
    const { user, signOut } = useAuth();
    const showSuccess = useSuccessModal();

    const handleLogout = async () => {
        try {
            await signOut();
            showSuccess("Logged out", "You have been logged out.");
        } catch (err) {
            console.error(err);
            Alert.alert("Could not log out", "Something went wrong. Please try again.");
        }
    };

    return (
        <ScreenContainer>
            <Text style={styles.title} accessibilityRole="header">
                {user?.username}
            </Text>
            <Text style={styles.text}>{user?.email}</Text>

            <View style={styles.button}>
                <ActionButton
                    title="My recipes"
                    onPress={() => navigation.navigate("RecipeCollection", { type: "mine" })}
                />
            </View>
            <View style={styles.button}>
                <ActionButton
                    title="Favorites"
                    onPress={() =>
                        navigation.navigate("RecipeCollection", { type: "favorites" })
                    }
                    variant="secondary"
                />
            </View>
            <View style={styles.button}>
                <ActionButton
                    title="Log out"
                    onPress={handleLogout}
                    variant="danger"
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        lineHeight: 37,
        fontWeight: "800",
        color: COLORS.primaryDark,
        marginBottom: 8,
    },
    text: { fontSize: 16, lineHeight: 24, color: COLORS.muted, marginBottom: 28 },
    button: { marginBottom: 12, minHeight: 44, justifyContent: "center" },
});