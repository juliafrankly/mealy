import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import RecipeListScreen from "../screens/RecipeListScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            {/* Public screens */}
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
            <Stack.Screen name="RecipeList" component={RecipeListScreen} options={{ title: "Recipes" }} />
            <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: "Recipe" }} />

            {token ? (
                // Protected screens: only registered when logged in
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
            ) : (
                // Only available when logged out
                <>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Log in" }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
                </>
            )}
        </Stack.Navigator>
    );
}