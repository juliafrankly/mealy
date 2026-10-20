import { useState } from "react";
import { Text, ActivityIndicator, Alert, View, StyleSheet } from "react-native";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import ScreenContainer from "../components/ScreenContainer";
import FormInput from "../components/FormInput";
import ActionButton from "../components/ActionButton";
import COLORS from "../constants/colors";

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
            Alert.alert("Account created", `Welcome to Mealy, ${user.username}!`);
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    return (
        <ScreenContainer>
            <Text style={styles.title} accessibilityRole="header">
                Create account
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
                label="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <FormInput
                label="Password (min 6 characters)"
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
                <ActivityIndicator size="large" accessibilityLabel="Creating account" />
            ) : (
                <ActionButton title="Register" onPress={handleRegister} />
            )}

            <View style={styles.link}>
                <ActionButton
                    title="Already have an account? Log in"
                    onPress={() => navigation.navigate("Login")}
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