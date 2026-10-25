import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { SuccessModalProvider } from "./context/SuccessModalContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <SuccessModalProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SuccessModalProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}