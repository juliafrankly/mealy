import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import COLORS from "../constants/colors";
import HomeScreen from "../screens/HomeScreen";
import RecipeListScreen from "../screens/RecipeListScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RecipeFormScreen from "../screens/RecipeFormScreen";
import RecipeCollectionScreen from "../screens/RecipeCollectionScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon: filled when the tab is selected, outlined otherwise
function icon(name) {
    return ({ focused, color, size }) => (
        <Ionicons
            name={focused ? name : `${name}-outline`}
            size={size}
            color={color}
        />
    );
}

// The "Create" tab never shows a screen of its own. Pressing it opens the
// recipe form in the stack above the tabs instead (see listeners below).
function CreatePlaceholder() {
    return null;
}

function MainTabs() {
    const { token } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primaryDark,
                tabBarInactiveTintColor: COLORS.muted,
                tabBarHideOnKeyboard: true,
            }}
        >
            {/* Public tabs */}
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: "Home",
                    tabBarIcon: icon("home"),
                }}
            />
            <Tab.Screen
                name="RecipeList"
                component={RecipeListScreen}
                options={{
                    title: "Recipes",
                    tabBarLabel: "Recipes",
                    tabBarIcon: icon("restaurant"),
                }}
            />

            {token ? (
                // Protected tabs: only registered when logged in
                <>
                    <Tab.Screen
                        name="Create"
                        component={CreatePlaceholder}
                        options={{
                            tabBarLabel: "Create",
                            tabBarAccessibilityLabel: "Create recipe",
                            tabBarIcon: icon("add-circle"),
                        }}
                        listeners={({ navigation }) => ({
                            tabPress: (e) => {
                                e.preventDefault();
                                navigation.navigate("RecipeForm");
                            },
                        })}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            title: "Profile",
                            tabBarLabel: "Profile",
                            tabBarIcon: icon("person"),
                        }}
                    />
                </>
            ) : (
                // Only available when logged out
                <Tab.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        title: "Log in",
                        tabBarLabel: "Log in",
                        tabBarIcon: icon("log-in"),
                    }}
                />
            )}
        </Tab.Navigator>
    );
}

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
            <Stack.Screen
                name="Tabs"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RecipeDetails"
                component={RecipeDetailsScreen}
                options={{ title: "Recipe" }}
            />

            {token ? (
                // Protected screens: only registered when logged in
                <>
                    <Stack.Screen
                        name="RecipeForm"
                        component={RecipeFormScreen}
                        options={({ route }) => ({
                            title: route.params?.recipe ? "Edit recipe" : "New recipe",
                        })}
                    />
                    <Stack.Screen
                        name="RecipeCollection"
                        component={RecipeCollectionScreen}
                        options={({ route }) => ({
                            title:
                                route.params.type === "mine" ? "My recipes" : "Favorites",
                        })}
                    />
                </>
            ) : (
                // Only available when logged out
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: "Register" }}
                />
            )}
        </Stack.Navigator>
    );
}