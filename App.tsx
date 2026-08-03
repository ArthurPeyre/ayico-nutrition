import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";

function Root() {
    const { hasToken } = useAuth();
    return hasToken ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Root />
            </NavigationContainer>
        </AuthProvider>
    );
}
