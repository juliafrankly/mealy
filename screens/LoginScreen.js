import { useState } from "react";
import { Text, ActivityIndicator, Alert, View, StyleSheet } from "react-native";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import ScreenContainer from "../components/ScreenContainer";
import FormInput from "../components/FormInput";
import ActionButton from "../components/ActionButton";
import COLORS from "../constants/colors";

export default function LoginScreen({ navigation }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        setError("");
        setSubmitting(true);
        try {
            const { token, user } = await login(email.trim(), password);
            await signIn(token, user);
            Alert.alert("Logged in", `Welcome back, ${user.username}!`);
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    return (
        <ScreenContainer>
            <Text style={styles.title} accessibilityRole="header">
                Log in
            </Text>

            <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
            />
            <FormInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            {error ? (
                <Text style={styles.error} accessibilityRole="alert">
                    {error}
                </Text>
            ) : null}

            {submitting ? (
                <ActivityIndicator size="large" accessibilityLabel="Logging in" />
            ) : (
                <ActionButton title="Log in" onPress={handleLogin} />
            )}

            <View style={styles.link}>
                <ActionButton
                    title="No account? Register"
                    onPress={() => navigation.navigate("Register")}
                    variant="secondary"
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
        marginBottom: 26,
    },
    error: { color: COLORS.danger, lineHeight: 22, marginBottom: 14 },
    link: { marginTop: 18, minHeight: 44, justifyContent: "center" },
});