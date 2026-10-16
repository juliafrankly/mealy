import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleRegister = async () => {
        setError("");
        setSubmitting(true);
        try {
            const { token, user } = await register(
                email.trim(),
                username.trim(),
                password
            );
            await signIn(token, user);
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create account</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                accessibilityLabel="Email"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                accessibilityLabel="Username"
            />
            <TextInput
                style={styles.input}
                placeholder="Password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                accessibilityLabel="Password"
            />

            {error ? (
                <Text style={styles.error} accessibilityRole="alert">
                    {error}
                </Text>
            ) : null}

            {submitting ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Register" onPress={handleRegister} />
            )}

            <View style={styles.link}>
                <Button
                    title="Already have an account? Log in"
                    onPress={() => navigation.navigate("Login")}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    error: { color: "#b00020", marginBottom: 12 },
    link: { marginTop: 16 },
});