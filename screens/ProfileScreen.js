import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import ScreenContainer from "../components/ScreenContainer";

export default function ProfileScreen({ navigation }) {
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            Alert.alert("Logged out", "You have been logged out.");
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
                <Button
                    title="My recipes"
                    onPress={() => navigation.navigate("RecipeCollection", { type: "mine" })}
                />
            </View>
            <View style={styles.button}>
                <Button
                    title="Favorites"
                    onPress={() =>
                        navigation.navigate("RecipeCollection", { type: "favorites" })
                    }
                />
            </View>
            <View style={styles.button}>
                <Button title="Log out" color="#b00020" onPress={handleLogout} />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
    text: { fontSize: 16, marginBottom: 24 },
    button: { marginBottom: 12 },
});