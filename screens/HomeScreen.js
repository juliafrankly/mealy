import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Mealy</Text>
            <Text style={styles.text}>
                Discover, save and share your favorite recipes.
            </Text>
            <Button
                title="Browse recipes"
                onPress={() => navigation.navigate("RecipeList")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
    text: { fontSize: 16, marginBottom: 24 },
});