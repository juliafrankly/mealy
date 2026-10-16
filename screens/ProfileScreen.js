import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{user?.username}</Text>
            <Text style={styles.text}>{user?.email}</Text>
            <Button title="Log out" onPress={signOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
    text: { fontSize: 16, marginBottom: 24 },
});