import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </AuthProvider>
  );
}