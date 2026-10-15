import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import RecipeListScreen from "../screens/RecipeListScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Hem" }} />
            <Stack.Screen name="RecipeList" component={RecipeListScreen} options={{ title: "Recept" }} />
        </Stack.Navigator>
    );
}