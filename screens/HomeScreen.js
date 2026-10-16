import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
    const { token } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Mealy</Text>
            <Text style={styles.text}>
                Discover, save and share your favorite recipes.
            </Text>

            <View style={styles.button}>
                <Button
                    title="Browse recipes"
                    onPress={() => navigation.navigate("RecipeList")}
                />
            </View>

            {token ? (
                <View style={styles.button}>
                    <Button
                        title="My profile"
                        onPress={() => navigation.navigate("Profile")}
                    />
                </View>
            ) : (
                <>
                    <View style={styles.button}>
                        <Button title="Log in" onPress={() => navigation.navigate("Login")} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Register" onPress={() => navigation.navigate("Register")} />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
    text: { fontSize: 16, marginBottom: 24 },
    button: { marginBottom: 12 },
});